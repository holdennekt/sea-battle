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
    this.name = undefined;
    this.inGame = false;
  }
}

class PlayersArray extends Array {
  delete(elem) {
    const index = this.findIndex((val) => val.socketId === elem.socketId);
    if (index !== -1) this.splice(index, 1);
    else throw new Error('no such element in array:', elem);
  }
  copy() {
    return Array.from(this);
  }
}

export { defs, User, PlayersArray };