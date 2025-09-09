export type MissionComplexity = "low" | "medium" | "high";

export interface MissionPlanStep {
	/** Human-readable step title */
	title: string;
	/** Optional description of the step */
	description?: string;
	/** Estimated effort in minutes */
	estimatedMinutes?: number;
}

export interface MissionInput {
	objective: string;
	complexity: MissionComplexity;
}

export interface MissionPlan {
	steps: MissionPlanStep[];
	complexity: MissionComplexity;
}

export interface Mission {
	id: string;
	objective: string;
	createdAt: string; // ISO string
	plan?: MissionPlan;
}


