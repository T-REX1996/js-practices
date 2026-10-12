import sqlite3 from "sqlite3";
import { run, all } from "./db_promise.js";

const db = new sqlite3.Database(":memory:");

await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);

try {
  await run(db, "INSERT INTO books (title) VALUES (?)", [null]);
} catch (err) {
  if (err.code === "SQLITE_CONSTRAINT") {
    console.error(err.message);
  } else {
    throw err;
  }
}

try {
  await all(db, "SELECT * FROM no_such_table");
} catch (err) {
  if (err.code === "SQLITE_ERROR") {
    console.error(err.message);
  } else {
    throw err;
  }
}

await run(db, "DROP TABLE books");
db.close();
