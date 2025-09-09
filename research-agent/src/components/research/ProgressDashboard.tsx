"use client";
import { useEffect, useRef, useState } from "react";

export interface ProgressEvent extends Record<string, unknown> {
	type: string;
}

interface ProgressDashboardProps {
	missionId: string;
	objective: string;
	steps: Array<{ title: string; description?: string }>;
	onEvent?: (event: ProgressEvent) => void;
}

export default function ProgressDashboard({ missionId, objective, steps, onEvent }: ProgressDashboardProps) {
	const [events, setEvents] = useState<ProgressEvent[]>([]);
	const [running, setRunning] = useState(false);
	const sourceRef = useRef<EventSource | null>(null);

	useEffect(() => {
		return () => {
			if (sourceRef.current) sourceRef.current.close();
		};
	}, []);

	async function start() {
		setEvents([]);
		setRunning(true);
		const res = await fetch(`/api/missions/${missionId}/execute`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ objective, steps }),
		});
		const reader = res.body?.getReader();
		if (!reader) return;
		const decoder = new TextDecoder();
		let buffer = "";
		while (true) {
			const { value, done } = await reader.read();
			if (done) break;
			buffer += decoder.decode(value, { stream: true });
			let idx;
			while ((idx = buffer.indexOf("\n\n")) !== -1) {
				const chunk = buffer.slice(0, idx).trim();
				buffer = buffer.slice(idx + 2);
				if (chunk.startsWith("data: ")) {
					try {
						const json: ProgressEvent = JSON.parse(chunk.slice(6));
						setEvents((prev) => [...prev, json]);
						if (onEvent) onEvent(json);
					} catch {}
				}
			}
		}
		setRunning(false);
	}

	return (
		<div className="w-full max-w-3xl mx-auto p-4">
			<div className="flex items-center justify-between mb-2">
				<h2 className="text-lg font-semibold">Execution progress</h2>
				<button
					className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-white text-sm font-medium disabled:opacity-50"
					disabled={running}
					onClick={start}
				>
					{running ? "Running..." : "Run mission"}
				</button>
			</div>
			<div className="space-y-3">
				{events
					.filter((e) => e.type === "step:start" || e.type === "step:summary")
					.map((e, i) => (
						<div key={i} className="rounded-md border border-gray-200 dark:border-neutral-800 p-3">
							{e.type === "step:start" ? (
								<p className="text-sm opacity-70">Starting: {(e as any).title}</p>
							) : (
								<div>
									<p className="text-sm font-medium mb-1">Step {(e as any).index + 1}</p>
									<p className="text-xs opacity-80 whitespace-pre-wrap">{(e as any).summary}</p>
								</div>
							)}
						</div>
					))}
			</div>
		</div>
	);
}


