import OpenAI from "openai";
import { z } from "zod";
import type { MissionInput, MissionPlan, MissionPlanStep } from "@/types/mission";

const StepSchema = z.object({
	title: z.string().min(3),
	description: z.string().optional(),
	estimatedMinutes: z.number().int().positive().max(8 * 60).optional(),
});

const PlanSchema = z.object({
	steps: z.array(StepSchema).min(3).max(20),
});

function getClient() {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
	return new OpenAI({ apiKey });
}

export async function planMission(input: MissionInput): Promise<MissionPlan> {
	const client = getClient();
	const system =
		"You are a senior research operations agent. Break objectives into clear, sequential steps with brief descriptions and realistic effort estimates (minutes). Prefer web search, source evaluation, synthesis, and reporting.";
	const user = `Objective: ${input.objective}\nComplexity: ${input.complexity}`;

	const response = await client.responses.create({
		model: "gpt-4o-mini",
		input: [
			{ role: "system", content: system },
			{
				role: "user",
				content:
					user +
					"\nReturn only JSON with { steps: [{ title, description, estimatedMinutes }] }. No extra commentary.",
			},
		],
		text: {
			format: {
				type: "json_object"
			}
		}
	});

	const text = response.output_text || "{}";
	const parsed = PlanSchema.safeParse(JSON.parse(text));
	if (!parsed.success) {
		throw new Error("Failed to parse plan from model");
	}
	const steps: MissionPlanStep[] = parsed.data.steps;
	return { steps, complexity: input.complexity };
}

function generateMockPlan(input: MissionInput): MissionPlan {
	const mockSteps: MissionPlanStep[] = [
		{
			title: "Initial web search and source discovery",
			description: "Search for recent articles, papers, and reports related to the research objective",
			estimatedMinutes: 15
		},
		{
			title: "Source evaluation and credibility assessment",
			description: "Review and assess the credibility of found sources, checking author credentials and publication quality",
			estimatedMinutes: 10
		},
		{
			title: "Data synthesis and analysis",
			description: "Compile findings from multiple sources and identify key patterns, trends, and insights",
			estimatedMinutes: 20
		},
		{
			title: "Report generation and citation formatting",
			description: "Create comprehensive report with proper citations and structured findings",
			estimatedMinutes: 15
		}
	];

	// Add complexity-based steps
	if (input.complexity === "high") {
		mockSteps.splice(2, 0, {
			title: "Deep dive analysis and expert consultation",
			description: "Conduct detailed analysis and seek expert opinions on complex aspects",
			estimatedMinutes: 30
		});
	}

	return { steps: mockSteps, complexity: input.complexity };
}


