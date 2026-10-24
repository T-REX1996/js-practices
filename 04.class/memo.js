#!/usr/bin/env node

import MemoApp from "./lib/memo-app.js";
import MemoRepository from "./lib/memo-repository.js";

const repository = new MemoRepository(
  new URL("./memos.json", import.meta.url).pathname,
);
const app = new MemoApp(repository);
await app.run(process.argv.slice(2));
