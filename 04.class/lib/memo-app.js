import { parseArgs } from "node:util";
import enquirer from "enquirer";

const { Select } = enquirer;

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
        reference: { type: "boolean", short: "r" },
        delete: { type: "boolean", short: "d" },
      },
    });

    if (values.list) {
      await this.#list();
    } else if (values.reference) {
      await this.#reference();
    } else if (values.delete) {
      await this.#remove();
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

  async #reference() {
    const memo = await this.#select("Choose a note you want to see:");
    if (memo === null) return;
    console.log(memo.body);
  }

  async #remove() {
    const memo = await this.#select("Choose a memo you want to delete:");
    if (memo === null) return;
    await this.#repository.delete(memo.id);
  }

  async #select(message) {
    const memos = await this.#repository.all();
    if (memos.length === 0) {
      console.log("メモがありません。");
      return null;
    }
    const prompt = new Select({
      message,
      choices: memos.map((memo) => ({
        name: String(memo.id),
        message: memo.title,
      })),
    });
    const selectedId = Number(await prompt.run());
    return memos.find((memo) => memo.id === selectedId);
  }

  async #readStdin() {
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString("utf8");
  }
}
