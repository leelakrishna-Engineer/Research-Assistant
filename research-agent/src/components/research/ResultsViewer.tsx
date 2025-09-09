"use client";
import { useMemo } from "react";

export interface StepResult {
	index: number;
	title: string;
	summary?: string;
	sources?: Array<{ title: string; url: string }>;
}

interface ResultsViewerProps {
	objective: string;
	results: StepResult[];
}

export default function ResultsViewer({ objective, results }: ResultsViewerProps) {
	const markdown = useMemo(() => {
		const lines: string[] = [];
		lines.push(`# Research Report`);
		lines.push("");
		lines.push(`Objective: ${objective}`);
		lines.push("");
		results.forEach((r) => {
			lines.push(`## ${r.index + 1}. ${r.title}`);
			if (r.summary) {
				lines.push("");
				lines.push(r.summary);
			}
			if (r.sources && r.sources.length) {
				lines.push("");
				lines.push("Sources:");
				r.sources.forEach((s) => lines.push(`- [${s.title}](${s.url})`));
			}
			lines.push("");
		});
		return lines.join("\n");
	}, [objective, results]);

	function download() {
		const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "report.md";
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<div className="w-full max-w-3xl mx-auto p-4">
			<div className="flex items-center justify-between mb-2">
				<h2 className="text-lg font-semibold">Results</h2>
				<button onClick={download} className="inline-flex items-center rounded-md bg-neutral-700 px-3 py-1.5 text-white text-sm font-medium">
					Download Markdown
				</button>
			</div>
			<div className="space-y-4">
				{results.map((r) => (
					<div key={r.index} className="rounded border border-gray-200 dark:border-neutral-800 p-3">
						<p className="font-medium mb-1">{r.index + 1}. {r.title}</p>
						{r.summary ? <p className="text-sm opacity-80 whitespace-pre-wrap">{r.summary}</p> : null}
						{r.sources && r.sources.length ? (
							<ul className="mt-2 text-xs list-disc pl-5 space-y-1">
								{r.sources.map((s, i) => (
									<li key={i}>
										<a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
									</li>
								))}
							</ul>
						) : null}
					</div>
				))}
			</div>
		</div>
	);
}


