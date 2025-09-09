"use client";
import MissionInput from "@/components/mission/MissionInput";
import MissionPlanner from "@/components/mission/MissionPlanner";
import type { MissionPlan } from "@/types/mission";
import { useState } from "react";
import ProgressDashboard from "@/components/research/ProgressDashboard";
import ResultsViewer, { type StepResult } from "@/components/research/ResultsViewer";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Home() {
	const [plan, setPlan] = useState<MissionPlan | null>(null);
	const [loading, setLoading] = useState(false);
	const [missionId, setMissionId] = useState<string | null>(null);
	const [objective, setObjective] = useState<string>("");
	const [results, setResults] = useState<StepResult[]>([]);

	return (
		<main className="min-h-screen w-full px-4 py-10">
			<div className="mx-auto max-w-4xl">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-semibold mb-1">Research Agent</h1>
						<p className="text-sm opacity-70">Autonomous research missions powered by AI planning and web search.</p>
					</div>
					<div className="flex items-center gap-3">
						<a href="/missions" className="text-sm underline">History</a>
						<ThemeToggle />
					</div>
				</div>
				<div className="h-6" />
				<MissionInput
					onSubmit={async (mission) => {
						setLoading(true);
						setPlan(null);
						setMissionId(null);
						setObjective(mission.objective);
						try {
							const res = await fetch("/api/missions/create", {
								method: "POST",
								headers: { "content-type": "application/json" },
								body: JSON.stringify(mission),
							});
							if (!res.ok) throw new Error("Failed to plan");
							const data = await res.json();
							setPlan(data.plan as MissionPlan);
							setMissionId(data.id as string);
						} catch (e) {
							console.error(e);
							alert("Planning failed. Check console and ensure OPENAI_API_KEY is set.");
						} finally {
							setLoading(false);
						}
					}}
				/>
				<MissionPlanner plan={plan} isLoading={loading} />
				{missionId && plan ? (
					<ProgressDashboard
						missionId={missionId}
						objective={objective}
						steps={plan.steps.map((s) => ({ title: s.title, description: s.description }))}
						onEvent={(e) => {
							if (e.type === "step:results") {
								// store citations
								const index = Number((e as any).index);
								const sources = ((e as any).results ?? []) as Array<{ title: string; url: string }>;
								setResults((prev) => {
									const next = [...prev];
									const existing = next.find((r) => r.index === index);
									if (existing) existing.sources = sources;
									else next.push({ index, title: plan.steps[index]?.title ?? `Step ${index + 1}`, sources });
									return next;
								});
							}
							if (e.type === "step:summary") {
								const index = Number((e as any).index);
								const summary = String((e as any).summary ?? "");
								setResults((prev) => {
									const next = [...prev];
									const existing = next.find((r) => r.index === index);
									if (existing) existing.summary = summary;
									else next.push({ index, title: plan.steps[index]?.title ?? `Step ${index + 1}`, summary });
									return next;
								});
							}
						}}
					/>
				) : null}
				{results.length ? <ResultsViewer objective={objective} results={[...results].sort((a, b) => a.index - b.index)} /> : null}
			</div>
		</main>
	);
}
