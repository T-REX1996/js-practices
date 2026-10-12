import sqlite3 from "sqlite3";
import { run, all } from "./db_promise.js";

const db = new sqlite3.Database(":memory:");

run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() =>
    run(db, "INSERT INTO books (title) VALUES (?)", [null]).catch((err) => {
      console.error(err.message);
    }),
  )
  .then(() =>
    all(db, "SELECT * FROM no_such_table").catch((err) => {
      console.error(err.message);
    }),
  )
  .then(() => run(db, "DROP TABLE books"))
  .then(() => db.close());
