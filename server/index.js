'use strict';

const express = require('express');
const { Server } = require('socket.io');
const { nanoid } = require('nanoid');

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
// const sessions = new Map();     //сделать через бд

io.on('connection', (connection) => {

  const { username } = connection.handshake.query;
  const player = { username, userId: connection.id };
  connection.player = player;

  // const session = sessions.get(player.sessionId);
  // if (session) player.userId = session.userId;
  // else {
  //   player.sessionId = nanoid();
  //   player.userId = nanoid();
  // }

  console.log('player at connection:', player);

  // sessions.set(player.sessionId, {
  //   userId: player.userId,
  //   username: player.username,
  //   connected: true,
  // });

  // connection.emit('session', { sessionId: player.sessionId });

  // connection.join(player.userId);

  connection.broadcast.emit('user:connected', player);
  
  const players = [];
  for (const [id, socket] of io.of('/').sockets) {
    if (id === connection.id) continue;
    players.push(socket.player);
  }
  connection.emit('users', players);
  console.log(players);

  connection.on('invite:send', (to) => {
    io.to(to).emit('invite:send', player.userId);
  });

  connection.on('invite:cancel', (to) => {
    io.to(to).emit('invite:cancel', player.userId);
  });  

  connection.on('invite:reject', (to) => {
    io.to(to).emit('invite:reject', player.userId);
  });

  connection.on('invite:accept', (from) => {
    io.to(from).emit('invite:accept', player.userId);
    //start new game here
  });

  connection.on('disconnect', async () => {
    const matchingSockets = await io.in(connection.id).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      connection.broadcast.emit('user:disconnected', player);
      console.log(`user ${player.username} disconnected`);
      // update the connection status of the session
      // sessions.set(player.sessionId, {
      //   userId: player.userId,
      //   username: player.username,
      //   connected: false,
      // });
    }
  });

  //new game events here(e.g. move, shipsSetup, gameOver etc)
});