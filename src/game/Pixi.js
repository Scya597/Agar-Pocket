import React, { Component } from 'react';
import { Application } from 'pixi.js';
import { Container, PlayerContainer, FoodContainer } from './container';


class Pixi extends Component {
  constructor(props) {
    super();
    this.state = {};
    this.socket = props.socket;
    this.uuid = props.uuid;
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
    this.app.stage.addChild(this.gameScene);

    this.playerContainer = new PlayerContainer();
    this.foodContainer = new FoodContainer();
    this.bgContainer = new Container();
    this.gameScene.addChild(this.playerContainer, this.foodContainer, this.bgContainer);
  }

  render() {
    return (
      <div className="pixi" ref="pixi" />
    );
  }
}

export default Pixi;
