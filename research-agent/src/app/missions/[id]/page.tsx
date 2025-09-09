import { getDb } from "@/lib/utils/db";

interface Params { params: Promise<{ id: string }> }

export default async function MissionDetailPage({ params }: Params) {
	const { id } = await params;
	const db = getDb();
	const row = db.prepare("SELECT * FROM missions WHERE id = ?").get(id);
	if (!row) return <div className="p-6">Not found</div>;
	const data = {
		id: row.id,
		objective: row.objective,
		complexity: row.complexity,
		plan: row.plan_json ? JSON.parse(row.plan_json) : null,
		results: row.results_json ? JSON.parse(row.results_json) : null,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
	return (
		<main className="min-h-screen w-full px-4 py-10">
			<div className="mx-auto max-w-4xl space-y-6">
				<div>
					<h1 className="text-2xl font-semibold mb-1">Mission</h1>
					<p className="text-sm opacity-70">{data.objective}</p>
				</div>
				{data.plan ? (
					<div>
						<h2 className="text-lg font-semibold mb-2">Planned steps</h2>
						<ol className="list-decimal pl-5 space-y-2">
							{data.plan.steps.map((s: any, i: number) => (
								<li key={i}>
									<p className="font-medium">{s.title}</p>
									{s.description ? <p className="text-sm opacity-80">{s.description}</p> : null}
								</li>
							))}
						</ol>
					</div>
				) : null}
				{data.results ? (
					<div>
						<h2 className="text-lg font-semibold mb-2">Results</h2>
						{data.results.map((r: any) => (
							<div key={r.index} className="rounded border border-gray-200 dark:border-neutral-800 p-3 mb-3">
								<p className="font-medium mb-1">{r.index + 1}. {r.title}</p>
								{r.summary ? <p className="text-sm opacity-80 whitespace-pre-wrap">{r.summary}</p> : null}
								{r.sources && r.sources.length ? (
									<ul className="mt-2 text-xs list-disc pl-5 space-y-1">
										{r.sources.map((s: any, i: number) => (
											<li key={i}><a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>
										))}
									</ul>
								) : null}
							</div>
						))}
					</div>
				) : null}
			</div>
		</main>
	);
}


