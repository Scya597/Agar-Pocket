import React, { Component } from 'react';
import { Application } from 'pixi.js';
import key from 'keymaster';
import { Container, PlayerContainer, FoodContainer, BgContainer } from './container';

class Pixi extends Component {
  constructor(props) {
    super();
    this.state = {};
    this.socket = props.socket;
    this.id = props.id;
    this.name = props.name;

    this.updateCamera = this.updateCamera.bind(this);
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
    this.gameScene.interactive = true;
    this.gameScene.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    this.app.stage.addChild(this.gameScene);
    window.onresize = () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      this.gameScene.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    };

    this.playerContainer = new PlayerContainer({
      socket: this.socket,
      id: this.id,
      updateCamera: this.updateCamera,
    });

    this.foodContainer = new FoodContainer({ socket: this.socket });
    this.bgContainer = new BgContainer();
    this.gameScene.addChild(this.bgContainer, this.playerContainer, this.foodContainer);

    this.emitInit();
    this.emitSpace();
    this.initTicker();
    this.playerContainer.onGetPlayersData();
    this.foodContainer.onGetFoodsData();
    this.bgContainer.generateBg();
  }
  initTicker() {
    this.app.ticker.add(() => {
      this.socket.emit('GET_DATA');
      this.socket.emit('MOUSE_MOVE', { mousePos: this.app.renderer.plugins.interaction.mouse.getLocalPosition(this.gameScene), id: this.id });
      this.playerContainer.onGetPlayersData();
    });
  }
  emitInit() {
    this.socket.emit('INIT', { id: this.id, name: this.name });
  }
  emitSpace() {
    key('space', () => {
      this.socket.emit('PRESS_SPACE', { id: this.id });
    });
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
