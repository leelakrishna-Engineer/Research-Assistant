import { getDb } from "@/lib/utils/db";
import Link from "next/link";

export default async function MissionsPage() {
	const db = getDb();
	const rows = db.prepare("SELECT id, objective, complexity, created_at, updated_at FROM missions ORDER BY created_at DESC").all();
	const missions = rows.map((r: any) => ({ id: r.id, objective: r.objective, complexity: r.complexity, createdAt: r.created_at, updatedAt: r.updated_at }));
	return (
		<main className="min-h-screen w-full px-4 py-10">
			<div className="mx-auto max-w-4xl">
				<div className="flex items-center gap-4 mb-6">
					<Link
						href="/"
						className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						<span className="text-sm font-medium">Back to Home</span>
					</Link>
					<h1 className="text-2xl font-semibold">Mission history</h1>
				</div>
				<div className="space-y-3">
					{missions.map((m) => (
						<a key={m.id} href={`/missions/${m.id}`} className="block rounded border border-gray-200 dark:border-neutral-800 p-3 hover:bg-gray-50 dark:hover:bg-neutral-900">
							<p className="font-medium">{m.objective}</p>
							<p className="text-xs opacity-70">{m.complexity} • {new Date(m.createdAt).toLocaleString()}</p>
						</a>
					))}
				</div>
			</div>
		</main>
	);
}


