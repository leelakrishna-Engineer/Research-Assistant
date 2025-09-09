import { getDb } from "@/lib/utils/db";

export async function GET() {
	const db = getDb();
	const rows = db.prepare("SELECT id, objective, complexity, created_at, updated_at FROM missions ORDER BY created_at DESC").all();
	return new Response(JSON.stringify(rows.map((r: any) => ({ id: r.id, objective: r.objective, complexity: r.complexity, createdAt: r.created_at, updatedAt: r.updated_at }))), { headers: { "content-type": "application/json" } });
}


