'use strict';

class Game {
  constructor(player) {
    const player1 = {
      username: player.username,
      userId: player.userId,
      opponent: player.opponent,
      gameId: player.gameId,
    };
    const player2 = {
      username: player.opponent.username,
      userId: player.opponent.userId,
      opponent: {
        username: player.username,
        userId: player.userId,
      },
      gameId: player.gameId,
    };
    this[player1.userId] = player1;
    this[player2.userId] = player2;
  }
  setToMove(toMove) {
    this.toMove = toMove;
  }
  setShips(userId, ships) {
    const myParts = {};
    for (const ship of ships) {
      for (const part of ship.parts) {
        const x = ship.x + part.x;
        const y = ship.y + part.y;
        const index100 = y * 10 + x;
        myParts[index100] = { x, y, parentId: part.parentId, isAlive: true };
      }
    }
    this[userId].myShips = ships;
    this[userId].myParts = myParts;
    this[userId].isReady = true;
    const opUserId = this[userId].opponent.userId;
    this[opUserId].opShips = ships.map(ship => ({
      length: ship.length,
      isAlive: true,
      id: ship.id,
      parts: [],
    }));
    this[opUserId].opParts = {};
  }
  getMoveResult(userId, { x, y }) {
    const opUserId = this[userId].opponent.userId;
    const opParts = this[opUserId].myParts;
    const index100 = y * 10 + x;
    const part = opParts[index100];
    if (part) {
      part.isAlive = false;
      const parentOpShip = this[userId].opShips.find(
        ship => ship.id === part.parentId
      );
      parentOpShip.parts.push(part);
      parentOpShip.parts.sort((a, b) => (a.x + a.y) - (b.x + b.y));
      const parentMyShip = this[opUserId].myShips.find(
        ship => ship.id === part.parentId
      );
      const myShipPart = parentMyShip.parts.find(
        part => part.x + parentMyShip.x === x && part.y + parentMyShip.y === y
      );
      myShipPart.isAlive = false;
      if (parentOpShip.length === parentOpShip.parts.length) {
        parentOpShip.isAlive = false;
        parentMyShip.isAlive = false;
      }
      // { length, isAlive, parts: [{ x, y, parentId }] } (x,y) - absolute
      return {
        result: { opShip: parentOpShip, myShip: parentMyShip },
        isHit: true,
      };
    }
    return { result: { x, y }, isHit: false };
  }
}

const getPlayers = (io, connection) => {
  const players = [];
  for (const [id, socket] of io.of('/').sockets) {
    if (id === connection.id) continue;
    players.push(socket.player);
  }
  return players;
};

const registerPlayersOnlineListeners = (io, socket) => {
  const { player } = socket;
  socket.emit('users', getPlayers(io, socket));

  // обробники запрошень
  socket.on('invite:send', ({ toUserId }) => {
    io.to(toUserId).emit('invite:send', { fromUserId: player.userId });
  });

  socket.on('invite:cancel', ({ toUserId }) => {
    io.to(toUserId).emit('invite:cancel', { fromUserId: player.userId });
  });

  socket.on('invite:reject', ({ fromUserId }) => {
    io.to(fromUserId).emit('invite:reject', { toUserId: player.userId });
  });

  socket.on('invite:accept', ({ fromUserId, gameId }) => {
    io.to(fromUserId).emit('invite:accept', {
      toUserId: player.userId,
      gameId,
    });
  });
};

const registerGameListeners = (io, socket, games) => {
  const { player } = socket;

  if (!games.get(player.gameId)) {
    console.log('GAME WAS SET');
    games.set(player.gameId, new Game(player, player.opponent));
    console.log(games);
  }

  socket.on('ships', ships => {
    const game = games.get(player.gameId);
    game.setShips(player.userId, ships);
    game.setToMove(player.userId);
    const opUserId = player.opponent.userId;
    if (game[opUserId].isReady) {
      socket.emit('game:started', game[player.userId].opShips);
      io.to(opUserId).emit('game:started', game[opUserId].opShips);
      socket.emit('move:request');
    }
  });

  socket.on('move:make', ({ x, y }) => {
    const game = games.get(player.gameId);
    const { result, isHit } = game.getMoveResult(player.userId, { x, y });
    if (isHit) {
      console.log(result);
      socket.emit('move:result', { result: result.opShip, isHit });
      io.to(player.opponent.userId).emit('move:opponent', {
        result: result.myShip,
        isHit,
      });
      socket.emit('move:request');
      game.setToMove(player.userId);
    } else {
      socket.emit('move:result', { result, isHit });
      io.to(player.opponent.userId).emit('move:opponent', { result, isHit });
      io.to(player.opponent.userId).emit('move:request');
      game.setToMove(player.opponent.userId);
    }
  });
};

module.exports = { registerPlayersOnlineListeners, registerGameListeners };
