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
const sessions = new Map();     //сделать через бд

io.use((socket, next) => {
  socket.player = socket.handshake.auth.user;
  console.log('player at io.use:', socket.player);
  if (socket.player.sessionId) {
    const session = sessions.get(socket.player.sessionId);
    if (session) {
      socket.player.userId = session.userId;
      return next();
    }
  } else {
    socket.player.sessionId = nanoid(8);
    socket.player.userId = nanoid(8);
  }
  next();
});

io.on('connection', (connection) => {

  const player = connection.player;
  console.log('player at connection:', player);

  sessions.set(player.sessionId, {
    userId: player.userId,
    username: player.username,
    connected: true,
  });

  connection.emit('session', {
    sessionId: player.sessionId,
    userId: player.userId,
  });

  connection.join(player.userId);

  connection.broadcast.emit('new player', player);
  
  const players = [];
  for (const [id, socket] of io.of('/').sockets) {
    if (socket === connection) continue;
    players.push(socket.player);
  }
  connection.emit('players', players);

  connection.on('inviteGame', (to) => {
    io.to(to.userId).emit('inviteGame', player);
  });

  connection.on('acceptGame', (from) => {
    io.to(from.userId).emit('acceptGame', player);
    //start new game here
  });

  connection.on('rejectGame', (to) => {
    io.to(to.userId).emit('rejectGame', player);
  });

  connection.on('disconnect', async () => {
    const matchingSockets = await io.in(player.userId).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      connection.broadcast.emit('player disconnected', player);
      console.log(`user ${player.username} disconnected`);
      // update the connection status of the session
      sessions.set(player.sessionId, {
        userId: player.userId,
        username: player.username,
        connected: false,
      });
    }
  });

  //new game events here(e.g. move, shipsSetup, gameOver etc)
});