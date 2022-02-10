const defs = {
  CODE_ENTER: 'Enter',
  MIN_USERNAME_LENGTH: 3,
  hostname: 'localhost',
  port: 8000,
  url(protocol = 'http', hostname = this.hostname, port = this.port, route = '/') {
    return protocol + '://' + hostname + ':' + port + route;
  }

};

class User {
  constructor() {
    this.inGame = false;
    this.authorised = false;
  }
}

class PlayersArray extends Array {
  find(elem) {
    return this.findIndex((player) => player.userId === elem.userId);
  }
  delete(elem) {
    const index = this.find(elem);
    if (index !== -1) this.splice(index, 1);
    else throw new Error(`no such element in array: ${elem}`);
  }
  copy() {
    const clone = new PlayersArray();
    clone.push(...this);
    return clone;
  }
  add(elem) {
    const index = this.find(elem);
    if (index !== -1) this.splice(index, 1, elem);
    else this.push(elem);
  }
}

export { defs, User, PlayersArray };