import { parseArgs } from "node:util";

export default class MemoApp {
  #repository;

  constructor(repository) {
    this.#repository = repository;
  }

  async run(argv) {
    const { values } = parseArgs({
      args: argv,
      options: {
        list: { type: "boolean", short: "l" },
      },
    });

    if (values.list) {
      await this.#list();
    } else {
      await this.#add();
    }
  }

  async #add() {
    const body = (await this.#readStdin()).trimEnd();
    if (body === "") {
      console.error("メモの内容が空です。");
      process.exitCode = 1;
      return;
    }
    await this.#repository.add(body);
  }

  async #list() {
    const memos = await this.#repository.all();
    if (memos.length === 0) {
      console.log("メモがありません。");
      return;
    }
    for (const memo of memos) {
      console.log(memo.title);
    }
  }

  async #readStdin() {
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString("utf8");
  }
}
