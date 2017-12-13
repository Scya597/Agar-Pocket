import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
import setting from '../src/game/config';
import { updatePlayerData } from './gameLogic';
import Player from './entity/player';

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

const userList = [];
const playerList = [];

io.on('connection', (socket) => {
  console.log('New client connected');
  // login
  socket.emit('GET_USERLIST', userList);

  socket.on('SET_NAME', (userInfo) => {
    userList.push({ name: userInfo.name, id: userInfo.id });
    console.log('socket on SET_NAME userList:', userList);
    io.emit('GET_USERLIST', userList);
  });
  // pixi
  socket.on('INIT', (player) => {
    const newPlayer = new Player({ id: player.id, name: player.name });
    playerList.push(newPlayer);
  });

  socket.on('MOUSE_MOVE', (mouseData) => {
    const player = playerList.find((element) => {
      if (element.id === mouseData.id) {
        return element;
      }
      return false;
    });
    if (player) {
      player.mousePos = mouseData.mousePos;
    }
  });

  socket.on('GET_DATA', () => {
    socket.emit('GET_PLAYERS_DATA', playerList);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    userList.splice(userList.findIndex(user => user.id === socket.handshake.query.id), 1);
    playerList.splice(playerList.findIndex(player => player.id === socket.handshake.query.id), 1);
    io.emit('GET_USERLIST', userList);
  });
});

setInterval(() => {
  updatePlayerData(playerList, setting);
}, 1000 / 60);

server.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
  console.log(process.env.NODE_ENV);
});

// GET_FOODS_DATA
// PRESS_SPACE
