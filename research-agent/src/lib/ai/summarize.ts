import OpenAI from "openai";

function getClient() {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
	return new OpenAI({ apiKey });
}

export async function summarizeContent(chunks: Array<{ title: string; url: string; content: string }>): Promise<string> {
	const client = getClient();
	const prompt = `Summarize the following sources with citations and note credibility signals. Return concise bullet points.\n\n${chunks
		.map((c, i) => `Source ${i + 1}: ${c.title} (${c.url})\n${c.content.slice(0, 2000)}`)
		.join("\n\n")}`;
	const resp = await client.responses.create({ model: "gpt-4o-mini", input: prompt });
	return resp.output_text || "";
}

function generateMockSummary(chunks: Array<{ title: string; url: string; content: string }>): string {
	const summaries = chunks.map((chunk, i) => 
		`• **${chunk.title}** (${chunk.url}): This source provides valuable insights on the research topic. The content appears credible and well-researched, offering detailed analysis and supporting evidence.`
	).join('\n\n');
	
	return `## Research Summary (Mock Mode)\n\n${summaries}\n\n*Note: This is a mock summary generated for demonstration purposes. In production mode with API keys, this would contain AI-generated analysis of the actual source content.*`;
}


