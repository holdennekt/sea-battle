'use strict';

const express = require('express');
const { Server } = require('socket.io');
const {
  registerPlayersOnlineListeners,
  registerGameListeners,
} = require('./registerListeners');

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

const games = new Map();

io.use((socket, next) => {
  const { username, userId, inGame, opponent, gameId } = socket.handshake.auth;
  socket.player = { username, userId, inGame, opponent, gameId };
  next();
});

io.on('connection', connection => {
  const { player } = connection;
  console.log('player at connection:', player);

  connection.join(player.userId);

  connection.broadcast.emit('user:connected', player);

  connection.onAny((...args) => {
    console.log(connection.player.username, 'send event:', ...args);
  });

  connection.on('disconnect', async () => {
    connection.broadcast.emit('user:disconnected', player);
    console.log(`user ${player.username} disconnected`);
  });

  if (!player.inGame) registerPlayersOnlineListeners(io, connection);
  else registerGameListeners(io, connection, games);
  // socket.on('ships', (ships) => {
  //   games.set()
  // });
});
