import { NextRequest } from "next/server";
import { z } from "zod";
import { tavilySearch } from "@/lib/search/tavily";
import { summarizeContent } from "@/lib/ai/summarize";
import { getDb } from "@/lib/utils/db";

const BodySchema = z.object({
	objective: z.string().min(10),
	steps: z.array(
		z.object({ title: z.string(), description: z.string().optional() })
	).min(1),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const encoder = new TextEncoder();
	const stream = new ReadableStream<Uint8Array>({
		start: async (controller) => {
			function push(event: unknown) {
				controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
			}

			try {
				const { id } = await params;
				const json = await req.json();
				const parsed = BodySchema.safeParse(json);
				if (!parsed.success) {
					push({ type: "error", message: "Invalid body" });
					controller.close();
					return;
				}

				const resultsForPersist: Array<{ index: number; title: string; summary?: string; sources?: Array<{ title: string; url: string }> }> = [];
				push({ type: "start", id, objective: parsed.data.objective });
				for (let i = 0; i < parsed.data.steps.length; i++) {
					const step = parsed.data.steps[i];
					push({ type: "step:start", index: i, title: step.title });
					// Simple heuristic: search if description/title suggests web info
					const needsSearch = /search|scan|review|collect|sources|benchmark|compare|market|state of the art/i.test(
						`${step.title} ${step.description ?? ""}`
					);
					let summary = "";
					if (needsSearch) {
						const searchQuery = `${parsed.data.objective} — ${step.title}`.slice(0, 250);
						const results = await tavilySearch(searchQuery, 5);
						const sources = results.results.slice(0, 5).map(r => ({ title: r.title, url: r.url }));
						push({ type: "step:results", index: i, results: sources });
						{
							const existing = resultsForPersist.find(r => r.index === i);
							if (existing) existing.sources = sources; else resultsForPersist.push({ index: i, title: step.title, sources });
						}
						summary = await summarizeContent(results.results.slice(0, 5).map(r => ({ title: r.title, url: r.url, content: r.content })));
					} else {
						summary = `Completed: ${step.title}`;
					}
					push({ type: "step:summary", index: i, summary });
					{
						const existing = resultsForPersist.find(r => r.index === i);
						if (existing) existing.summary = summary; else resultsForPersist.push({ index: i, title: step.title, summary });
					}
					push({ type: "step:end", index: i });
				}
				push({ type: "end" });
				// Save results snapshot
				try {
					const db = getDb();
					db.prepare("UPDATE missions SET results_json = ?, updated_at = ? WHERE id = ?").run(
						JSON.stringify(resultsForPersist),
						new Date().toISOString(),
						id
					);
				} catch {}
				controller.close();
			} catch (e) {
				push({ type: "error", message: "Execution failed" });
				controller.close();
			}
		},
	});

	return new Response(stream, {
		headers: {
			"content-type": "text/event-stream",
			"cache-control": "no-cache",
			connection: "keep-alive",
		},
	});
}


