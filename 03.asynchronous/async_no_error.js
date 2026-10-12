import sqlite3 from "sqlite3";
import { run, all } from "./db_promise.js";

const db = new sqlite3.Database(":memory:");

await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
const result = await run(db, "INSERT INTO books (title) VALUES (?)", [
  "本のタイトル",
]);
console.log(result.lastID);
const rows = await all(db, "SELECT * FROM books");
console.log(rows);
await run(db, "DROP TABLE books");
db.close();
