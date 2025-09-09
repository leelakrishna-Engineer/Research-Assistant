import { NextRequest } from "next/server";
import { z } from "zod";
import { tavilySearch } from "@/lib/search/tavily";

const BodySchema = z.object({ query: z.string().min(3), maxResults: z.number().int().min(1).max(10).optional() });

export async function POST(req: NextRequest) {
	try {
		const json = await req.json();
		const parsed = BodySchema.safeParse(json);
		if (!parsed.success) return new Response(JSON.stringify({ error: "Invalid body" }), { status: 400, headers: { "content-type": "application/json" } });
		const data = await tavilySearch(parsed.data.query, parsed.data.maxResults);
		return new Response(JSON.stringify(data), { status: 200, headers: { "content-type": "application/json" } });
	} catch (e) {
		console.error(e);
		return new Response(JSON.stringify({ error: "Search failed" }), { status: 500, headers: { "content-type": "application/json" } });
	}
}


