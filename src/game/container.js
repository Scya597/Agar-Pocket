import { Container, Point, Graphics } from 'pixi.js';
import { Sprite, CellSprite, FoodSprite } from './sprite';
import config from './config';
let temp = 0;
class PlayerContainer extends Container {
  constructor(arg) {
    super();
    this.socket = arg.socket;
    this.id = arg.id;
    this.updateCamera = arg.updateCamera;
    this.centroid = new Point();
  }
  onGetPlayersData() {
    this.socket.on('GET_PLAYERS_DATA', (playerList) => {
      playerList.forEach((player) => {
        player.cellList.forEach((cell) => {
          let sprite = this.children.find(child => child.id === cell.id);
          if (sprite === undefined) {
            sprite = new CellSprite(cell);
            this.addChild(sprite);
            console.log(this.children);
          }
          sprite.updatePos(cell.pos);
          sprite.updateCell(cell); // update size
          sprite.flag = true;
        });
        if (player.id === this.id) {
          const mx = player.cellList.reduce((acc, cell) => acc + (cell.x * cell.mass));
          const my = player.cellList.reduce((acc, cell) => acc + (cell.y * cell.mass));
          const m = player.cellList.reduce((acc, cell) => acc + cell.mass);
          this.centroid.set(mx / m, my / m);
          this.updateCamera(this.centroid);
        }
      });

      const arr = [];
      // clean children
      this.children.forEach((child, i) => {
        if (child.flag === false) {
          arr.push(i);
        }
        // FIXME: LINT ERROR BUT DON'T KNOW HOW TO FIX
        child.flag = false; // reset
      });
      arr.reverse().forEach((i) => {
        this.removeChildAt(i);
      });
    });
  }
}

class FoodContainer extends Container {
  constructor(arg) {
    super();
    this.socket = arg.socket;
  }
  onGetFoodsData() {
    this.socket.on('GET_FOODS_DATA', (foodList) => {
      foodList.forEach((food) => {
        let sprite = this.children.find(child => child.id === food.id);
        if (sprite === undefined) {
          sprite = new FoodSprite(food);
          this.addChild(sprite);
        }
        sprite.updatePos(food.pos);
        sprite.flag = true;
      });

      const arr = [];
      // clean children
      this.children.forEach((child, i) => {
        if (child.flag === false) {
          arr.push(i);
        }
        // FIXME: LINT ERROR BUT DON'T KNOW HOW TO FIX
        child.flag = false; // reset
      });
      arr.reverse().forEach((i) => {
        this.removeChildAt(i);
      });
    });
  }
}

class BgContainer extends Container {
  generateBg() {
    this.addChild(BgContainer.generateRect());
  }
  static generateRect() {
    const graphics = new Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, config.worldWidth, config.worldHeight);
    graphics.endFill();
    const sprite = new Sprite(graphics.generateCanvasTexture());
    return sprite;
  }
}
export { Container, PlayerContainer, FoodContainer, BgContainer };
