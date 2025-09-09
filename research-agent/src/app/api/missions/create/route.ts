import { NextRequest } from "next/server";
import { planMission } from "@/lib/ai/planner";
import { z } from "zod";
import { generateId } from "@/lib/utils";
import { getDb } from "@/lib/utils/db";

const BodySchema = z.object({
	objective: z.string().min(10),
	complexity: z.enum(["low", "medium", "high"]),
});

export async function POST(req: NextRequest) {
	try {
		const json = await req.json();
		const parsed = BodySchema.safeParse(json);
		if (!parsed.success) {
			return new Response(JSON.stringify({ error: "Invalid body" }), {
				status: 400,
				headers: { "content-type": "application/json" },
			});
		}
		const mission = await planMission(parsed.data);
		const id = generateId();
		const db = getDb();
		db.prepare(
			`INSERT INTO missions (id, objective, complexity, plan_json, results_json, created_at, updated_at)
			 VALUES (@id, @objective, @complexity, @plan_json, @results_json, @created_at, @updated_at)`
		).run({
			id,
			objective: parsed.data.objective,
			complexity: parsed.data.complexity,
			plan_json: JSON.stringify(mission),
			results_json: null,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		});
		return new Response(
			JSON.stringify({ id, objective: parsed.data.objective, plan: mission }),
			{ status: 200, headers: { "content-type": "application/json" } }
		);
	} catch (err: unknown) {
		console.error(err);
		return new Response(JSON.stringify({ error: "Planning failed" }), {
			status: 500,
			headers: { "content-type": "application/json" },
		});
	}
}


