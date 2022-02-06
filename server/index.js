'use strict';

const express = require('express');
const app = express();
app.use(express.static(__dirname + '/../client/build'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../client/build/index.html');
});

const hostname = 'localhost';
const port = 8000;

const server = app.listen(port, hostname);

const { Server } = require('socket.io');
const io = new Server(server);

io.use((socket, next) => {
  socket.player = socket.handshake.auth;
  socket.player.socketId = socket.id;
  next();
});

io.on('connection', (connection) => {
  
  const players = [];
  const player = connection.player;
  connection.broadcast.emit('new player', player);

  for (const [id, socket] of io.of('/').sockets) {
    if (socket === connection) continue;
    players.push(socket.player);
  }
  connection.emit('players', players);

  connection.on('inviteGame', (to) => {
    io.to(to.socketId).emit('inviteGame', player);
  });

  connection.on('acceptGame', (from) => {
    io.to(from.socketId).emit('acceptGame', player);
    //start new game here
  });

  connection.on('rejectGame', (to) => {
    io.to(to.socketId).emit('rejectGame', player);
  });

  connection.on('disconnect', () => {
    console.log(`user ${connection.username} disconnected`);
    for (const [id, socket] of io.of('/').sockets) {
      if (socket === connection) continue;
      socket.emit('player disconnected', player);
    }
  });

  //new game events here(e.g. move, shipsSetup, gameOver etc)
});