'use strict';

const express = require('express');
const { Server } = require('socket.io');

const hostname = 'localhost';
const port = 8000;

const app = express();
app.use(express.static(__dirname + '/../client/build'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../client/build/index.html');
});

app.get('*', (req, res) => {
  res.redirect('/');
});

const server = app.listen(port, hostname);
const io = new Server(server);

io.on('connection', (connection) => {

  const { username } = connection.handshake.query;
  const player = { username, userId: connection.id, inGame: false };
  connection.player = player;
  console.log('player at connection:', player);

  connection.broadcast.emit('user:connected', player);
  
  const players = [];
  for (const [id, socket] of io.of('/').sockets) {
    if (id === connection.id) continue;
    players.push(socket.player);
  }
  connection.emit('users', players);
  console.log({ playersOnline: players });

  connection.onAny((...args) => {
    console.log(connection.player.username, "send event:", ...args);
  });

  connection.on('invite:send', ({ toUserId }) => {
    io.to(toUserId).emit('invite:send', { fromUserId: player.userId });
  });

  connection.on('invite:cancel', ({ toUserId }) => {
    io.to(toUserId).emit('invite:cancel', { fromUserId: player.userId });
  });  

  connection.on('invite:reject', ({ fromUserId }) => {
    io.to(fromUserId).emit('invite:reject', { toUserId: player.userId });
  });

  connection.on('invite:accept', ({ fromUserId }) => {
    io.to(fromUserId).emit('invite:accept', { toUserId: player.userId });
    //start new game here
  });

  connection.on('status:change', ({ inGame, inGameWith }) => {
    for (const [id, socket] of io.of('/').sockets) {
      if (id === connection.id || id === inGameWith.userId) continue;
      socket.emit('status:change', { fromUserId: player.userId, inGame, inGameWith });
    }
  });

  connection.on('disconnect', async () => {
    const matchingSockets = await io.in(connection.id).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      connection.broadcast.emit('user:disconnected', player);
      console.log(`user ${player.username} disconnected`);
    }
  });

  //new game events here(e.g. move, shipsSetup, gameOver etc)
});