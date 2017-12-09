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
    this.id = props.uuid;
    this.name = props.name;
  }
  componentDidMount() {
    const appConfig = {
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
    };
    this.app = new Application(appConfig);
    this.refs.pixi.appendChild(this.app.view);

    this.gameScene = new Container();
    this.gameScene.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    this.gameScene.interactive = true;
    this.app.stage.addChild(this.gameScene);

    this.playerContainer = new PlayerContainer(this.socket, this.id, this.updateCamera);
    this.foodContainer = new FoodContainer(this.socket);
    this.bgContainer = new BgContainer();
    this.gameScene.addChild(this.playerContainer, this.foodContainer, this.bgContainer);

    this.playerContainer.onGetPlayersData();
    this.foodContainer.onGetFoodsData();
    this.bgContainer.generateBg();
    this.emitInit();
    this.emitMouseMove();
    this.emitSpace();
  }
  emitSpace = () => {
    key('space', () => {
      this.socket.emit(this.uuid);
    });
  }
  emitMouseMove = () => {
    this.gameScene.on('mousemove', (e) => {
      const mousePos = e.data.getLocalPosition(this.gameScene);
      this.socket.emit('Mouse_Move', this.uuid, mousePos);
    });
  }
  emitInit = () => {
    // FIXME: name
    this.socket.emit('INIT', this.id, this.name);
  }
  updateCamera = (pos) => {
    this.gameScene.pivot.copy(pos);
  }
  render() {
    return (
      <div className="pixi" ref="pixi" />
    );
  }
}

export default Pixi;
