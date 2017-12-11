import React, { Component } from 'react';
import { Application, Sprite } from 'pixi.js';
import key from 'keymaster';
import { Container, PlayerContainer, FoodContainer, BgContainer } from './container';
import { circleRadius } from './config';


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
    this.pixi.appendChild(this.app.view);

    this.gameScene = new Container();
    this.gameScene.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    this.gameScene.interactive = true;
    this.app.stage.addChild(this.gameScene);

    this.playerContainer = new PlayerContainer(this.socket, this.id, this.updateCamera.bind(this));
    this.foodContainer = new FoodContainer(this.socket);
    this.bgContainer = new BgContainer();
    this.gameScene.addChild(this.playerContainer, this.foodContainer, this.bgContainer);

    this.playerContainer.onGetPlayersData();
    this.foodContainer.onGetFoodsData();
    this.bgContainer.generateBg();
    this.initTicker();
    this.emitInit();
    this.emitMouseMove();
    this.emitSpace();
    /*
    this.app.ticker.add(() => {
      this.socket.emit('update');
      this.socket.on('updateClientPos', (playerList) => {
        playerList.forEach((player) => {
          const sprite = this.gameScene.children.find({ uuid: player.uuid });
          if (!sprite) {
            // not exist in gameScene
            // create circle
            let circle;
            if (this.uuid === player.uuid) { // my sprite
              circle = new Sprite(this.createCircle(0x3080e8, 0, 0, circleRadius)
                .generateCanvasTexture());
            } else {
              circle = new Sprite(this.createCircle(0x9ce5f4, 0, 0, circleRadius)
                .generateCanvasTexture());
            }

            circle.anchor.set(0.5, 0.5);
            circle.uuid = player.uuid;
            circle.x = player.x;
            circle.y = player.y;

            this.gameScene.addChild(circle);
            if (this.uuid === player.uuid) {
              // my sprite
              this.gameScene.on('mousemove', (e) => {
                const { x, y } = e.data.getLocalPosition(this.gameScene);
                const theta = Math.atan2(y - circle.y, x - circle.x);
                this.socket.emit('mouseMove', this.uuid, theta);
                this.gameScene.pivot.copy(circle.position);
              });
            }
          } else {
            // already exist in camera
            sprite.x = player.x;
            sprite.y = player.y;
            if (this.uuid === player.uuid) {
              // my sprite
              this.gameScene.pivot.copy(sprite.position);
            }
          }
        });
      });
    });
    // delete player socket on
    this.socket.on('deletePlayer', (uuid) => {
      const sprite = this.gameScene.children.find({ uuid });
      this.gameScene.removeChild(sprite);
    });
    */
  }
  initTicker() {
    this.app.ticker.add(() => {
      this.socket.emit('GET_DATA');
    });
  }
  emitSpace() {
    key('space', () => {
      this.socket.emit(this.uuid);
    });
  }
  emitMouseMove() {
    this.gameScene.on('mousemove', (e) => {
      const mousePos = e.data.getLocalPosition(this.gameScene);
      this.socket.emit('Mouse_Move', this.uuid, mousePos);
    });
  }
  emitInit() {
    // FIXME: name
    this.socket.emit('INIT', this.id, this.name);
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
