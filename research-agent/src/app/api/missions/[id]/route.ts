import { NextRequest } from "next/server";
import { getDb } from "@/lib/utils/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const db = getDb();
	const row = db.prepare("SELECT * FROM missions WHERE id = ?").get(id);
	if (!row) return new Response("Not found", { status: 404 });
	return new Response(
		JSON.stringify({
			id: row.id,
			objective: row.objective,
			complexity: row.complexity,
			plan: row.plan_json ? JSON.parse(row.plan_json) : null,
			results: row.results_json ? JSON.parse(row.results_json) : null,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
		}),
		{ headers: { "content-type": "application/json" } }
	);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const db = getDb();
	const body = await req.json();
	db.prepare("UPDATE missions SET results_json = ?, updated_at = ? WHERE id = ?").run(
		JSON.stringify(body.results ?? null),
		new Date().toISOString(),
		id
	);
	return new Response("OK");
}


