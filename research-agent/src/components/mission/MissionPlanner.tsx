import type { MissionPlan } from "@/types/mission";

interface MissionPlannerProps {
	plan: MissionPlan | null;
	isLoading?: boolean;
}

export default function MissionPlanner({ plan, isLoading }: MissionPlannerProps) {
	if (isLoading) {
		return (
			<div className="w-full max-w-3xl mx-auto p-4 animate-pulse">
				<p className="text-sm opacity-70">Planning mission...</p>
				<div className="mt-3 space-y-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="h-4 bg-gray-200 dark:bg-neutral-800 rounded" />
					))}
				</div>
			</div>
		);
	}

	if (!plan) return null;

	return (
		<div className="w-full max-w-3xl mx-auto p-4">
			<h2 className="text-lg font-semibold mb-2">Planned steps</h2>
			<ol className="space-y-3 list-decimal pl-5">
				{plan.steps.map((s, idx) => (
					<li key={idx} className="space-y-1">
						<p className="font-medium">{s.title}</p>
						{s.description ? (
							<p className="text-sm opacity-80">{s.description}</p>
						) : null}
						{s.estimatedMinutes ? (
							<p className="text-xs opacity-60">~{s.estimatedMinutes} min</p>
						) : null}
					</li>
				))}
			</ol>
		</div>
	);
}


