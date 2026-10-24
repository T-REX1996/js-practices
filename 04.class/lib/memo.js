export default class Memo {
  constructor({ id, body }) {
    this.id = id;
    this.body = body;
  }

  get title() {
    return this.body.split("\n")[0];
  }
}
