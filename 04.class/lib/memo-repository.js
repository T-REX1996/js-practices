import fs from "node:fs/promises";
import Memo from "./memo.js";

export default class MemoRepository {
  #path;

  constructor(path) {
    this.#path = path;
  }

  async all() {
    const rows = await this.#read();
    return rows.map((row) => new Memo(row));
  }

  async add(body) {
    const rows = await this.#read();
    const id =
      rows.length === 0 ? 1 : Math.max(...rows.map((row) => row.id)) + 1;
    rows.push({ id, body });
    await this.#write(rows);
  }

  async delete(id) {
    const rows = await this.#read();
    await this.#write(rows.filter((row) => row.id !== id));
  }

  async #read() {
    try {
      return JSON.parse(await fs.readFile(this.#path, "utf8"));
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async #write(rows) {
    await fs.writeFile(this.#path, JSON.stringify(rows, null, 2));
  }
}
