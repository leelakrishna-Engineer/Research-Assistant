"use client";

import { useMemo, useState } from "react";
import type { MissionComplexity, MissionInput as MissionInputType } from "@/types/mission";

interface MissionInputProps {
	onSubmit: (mission: MissionInputType) => void;
}

function estimateComplexity(objective: string): MissionComplexity {
	const lengthScore = objective.trim().length;
	const keywordScore = (/\b(meta-analysis|systematic review|compar|benchmark|market sizing|regression|RCT|state of the art)\b/i.test(objective) ? 2 : 0)
		+ (/\bmultiple sources|comprehensive|deep dive|timeline|history|forecast|roadmap\b/i.test(objective) ? 1 : 0);
	const score = Math.min(3, Math.ceil(lengthScore / 280) + keywordScore);
	if (score <= 1) return "low";
	if (score === 2) return "medium";
	return "high";
}

export default function MissionInput({ onSubmit }: MissionInputProps) {
	const [objective, setObjective] = useState("");
	const complexity = useMemo(() => estimateComplexity(objective), [objective]);
	const isDisabled = objective.trim().length < 10;

	return (
		<div className="w-full max-w-3xl mx-auto p-4">
			<div className="space-y-4">
				<label htmlFor="objective" className="block text-sm font-medium">
					Research mission
				</label>
				<textarea
					id="objective"
					value={objective}
					onChange={(e) => setObjective(e.target.value)}
					placeholder="e.g., Analyze the current state of small language models (SLMs) vs. LLMs for on-device AI, including benchmarks, costs, and recent research (past 6 months)."
					rows={6}
					className="w-full rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>

				<div className="flex items-center justify-between text-sm">
					<div className="flex items-center gap-2">
						<span className="opacity-70">Estimated complexity:</span>
						<span
							className={
								complexity === "low"
									? "text-green-600"
								: complexity === "medium"
								? "text-amber-600"
								: "text-red-600"
							}
						>
							{complexity.toUpperCase()}
						</span>
					</div>
					<button
						type="button"
						disabled={isDisabled}
						onClick={() => onSubmit({ objective: objective.trim(), complexity })}
						className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium disabled:opacity-50 hover:bg-blue-700"
					>
						Start mission
					</button>
				</div>

				<div className="text-xs opacity-70 space-y-2">
					<p className="font-medium">Examples of good missions:</p>
					<ul className="list-disc pl-5 space-y-1">
						<li>Compare leading vector databases for retrieval-augmented generation: performance, cost, operational complexity.</li>
						<li>Synthesize credible sources on health effects of intermittent fasting in adults; include citations.</li>
						<li>Market scan: top 10 open-source observability tools; feature matrix and licensing.</li>
					</ul>
				</div>
			</div>
		</div>
	);
}


