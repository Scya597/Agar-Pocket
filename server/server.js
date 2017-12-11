import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
import setting from '../src/game/config';
import { updateClientPos } from './gameLogic';

const path = require('path');
const http = require('http');

const app = express();

// set webpack development/production mode
if (process.env.NODE_ENV === 'dev') {
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpack = require('webpack');
  const webpackDevConfig = require('../webpack.dev.config.js');
  const compiler = webpack(webpackDevConfig);
  const middleware = webpackMiddleware(compiler, {
    publicPath: webpackDevConfig.output.publicPath,
    stats: { colors: true },
  });
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
} else {
  app.use(express.static('public'));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
}

app.use(bodyParser.json());

app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
  next();
});

const server = http.createServer(app);
const io = require('socket.io')(server);

let userList = [];
let playerList = [];

const startX = 100;
const startY = 100;

io.on('connection', (socket) => {
  console.log(`New client ${socket.handshake.query.uuid} connected`);
  // login
  socket.emit('GET_USERLIST', userList);

  socket.on('SET_NAME', (name, uuid) => {
    userList.push({ name, uuid });
    io.emit('GET_USERLIST', userList);
  });
  // pixi
  socket.on('INIT', (player) => {
    playerList.push({ id: player.id, x: startX, y: startY });
  });

  socket.on('update', () => {
    socket.emit('GET_PLAYERS_DATA', playerList);
  });

  socket.on('MOUSE_MOVE', (mouseData) => {
    const player = playerList.find({ id: mouseData.id });
    if (player) {
      player.pos = mouseData.mousePos;
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client ${socket.handshake.query.uuid} disconnected`);
    userList = userList.filter(user => user.uuid !== socket.handshake.query.uuid);
    playerList = playerList.filter(player => player.uuid !== socket.handshake.query.uuid);
    // _.remove(userList, user => user.uuid === socket.handshake.query.uuid);
    // _.remove(playerList, player => player.uuid === socket.handshake.query.uuid);
    io.emit('GET_USERLIST', userList);
    // io.emit('deletePlayer', socket.handshake.query.uuid);
  });
});

setInterval(() => {
  updateClientPos(playerList, setting);
}, 1000 / 60);

server.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
  console.log(process.env.NODE_ENV);
});

// GET_FOODS_DATA
// PRESS_SPACE
