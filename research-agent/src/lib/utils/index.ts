export function generateId(prefix: string = "mission"): string {
	const base = Math.random().toString(36).slice(2, 10);
	const ts = Date.now().toString(36);
	return `${prefix}_${ts}_${base}`;
}


