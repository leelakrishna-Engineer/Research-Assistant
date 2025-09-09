import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let db: Database.Database | null = null;

export function getDb() {
	if (db) return db;
	const dataDir = path.join(process.cwd(), ".data");
	if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
	const file = path.join(dataDir, "missions.sqlite");
	db = new Database(file);
	db.pragma("journal_mode = WAL");
	db.exec(`
		CREATE TABLE IF NOT EXISTS missions (
			id TEXT PRIMARY KEY,
			objective TEXT NOT NULL,
			complexity TEXT NOT NULL,
			plan_json TEXT,
			results_json TEXT,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		);
	`);
	return db;
}


