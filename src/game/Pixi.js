import React, { Component } from 'react';
import { Application } from 'pixi.js';
import key from 'keymaster';
import { Container, PlayerContainer, FoodContainer, BgContainer } from './container';

class Pixi extends Component {
  constructor(props) {
    super();
    this.state = {};
    this.socket = props.socket;
    // FIXME:統一叫id?
    this.id = props.id;
    this.name = props.name;
  }

  componentDidMount() {
    const appConfig = {
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
    };
    this.app = new Application(appConfig);
    this.pixi.appendChild(this.app.view);

    this.gameScene = new Container();
    this.gameScene.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    this.gameScene.interactive = true;
    this.app.stage.addChild(this.gameScene);

    this.playerContainer = new PlayerContainer({
      socket: this.socket,
      id: this.id,
      updateCamera: this.updateCamera,
    });

    this.foodContainer = new FoodContainer({ socket: this.socket });
    this.bgContainer = new BgContainer();
    this.gameScene.addChild(this.playerContainer, this.foodContainer, this.bgContainer);

    this.playerContainer.onGetPlayersData();
    this.foodContainer.onGetFoodsData();
    this.bgContainer.generateBg();
    this.initTicker();
    this.emitInit();
    this.emitMouseMove();
    this.emitSpace();
  }
  initTicker() {
    this.app.ticker.add(() => {
      this.socket.emit('GET_DATA');
    });
  }
  emitSpace() {
    key('space', () => {
      this.socket.emit('PRESS_SPACE', { id: this.id });
    });
  }
  emitMouseMove() {
    this.gameScene.on('mousemove', (e) => {
      const mousePos = e.data.getLocalPosition(this.gameScene);
      this.socket.emit('MOUSE_MOVE', { id: this.id, mousePos });
    });
  }
  emitInit() {
    // FIXME: name
    this.socket.emit('INIT', { id: this.id, name: this.name });
  }
  updateCamera(pos) {
    this.gameScene.pivot.copy(pos);
  }

  render() {
    return (
      <div className="pixi" ref={(pixi) => { this.pixi = pixi; }} />
    );
  }
}

export default Pixi;
