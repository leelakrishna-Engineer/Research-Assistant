export interface TavilyResultItem {
	title: string;
	url: string;
	content: string;
	score?: number;
}

export interface TavilySearchResponse {
	results: TavilyResultItem[];
	answer?: string;
}

export async function tavilySearch(query: string, maxResults: number = 5): Promise<TavilySearchResponse> {
	const apiKey = process.env.TAVILY_API_KEY;
	if (!apiKey) throw new Error("Missing TAVILY_API_KEY");
	const res = await fetch("https://api.tavily.com/search", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			api_key: apiKey,
			query,
			search_depth: "advanced",
			max_results: Math.max(1, Math.min(10, maxResults)),
			include_answer: true,
		}),
	});
	if (!res.ok) {
		throw new Error(`Tavily request failed: ${res.status}`);
	}
	const data = (await res.json()) as TavilySearchResponse;
	return data;
}


