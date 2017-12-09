import { Container, Point, Graphics } from 'pixi.js';
import { Sprite, CellSprite, FoodSprite } from './sprite';
import { worldWidth, worldHeight } from './config';

class PlayerContainer extends Container {
  constructor(socket, id, cb) {
    super();
    this.socket = socket;
    this.id = id;
    this.cb = cb;
    this.centroid = new Point();
  }
  onGetPlayersData() {
    this.socket.on('GET_PLAYERS_DATA', (playerArr) => {
      playerArr.forEach((player) => {
        player.cellArr.forEach((cell) => {
          let sprite = this.children.find(child => child.id === cell.id);
          if (sprite === undefined) {
            sprite = new CellSprite(cell);
            this.addChild(sprite);
          }
          sprite.updatePos(cell.pos);
          sprite.updateCell(cell); // update size
          sprite.flag = true;
        });
        if (player.id === this.id) {
          const mx = player.cellArr.reduce((acc, cell) => acc + (cell.x * cell.mass));
          const my = player.cellArr.reduce((acc, cell) => acc + (cell.y * cell.mass));
          const m = player.cellArr.reduce((acc, cell) => acc + cell.mass);
          this.centroid.set(mx / m, my / m);
          this.cb(this.centroid);
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
  constructor(socket) {
    super();
    this.socket = socket;
  }
  onGetFoodsData() {
    this.socket.on('GET_FOODS_DATA', (foodArr) => {
      foodArr.forEach((food) => {
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
    graphics.drawRect(0, 0, worldWidth, worldHeight);
    graphics.endFill();
    const sprite = new Sprite(graphics.generateCanvasTexture());
    return sprite;
  }
}
export { Container, PlayerContainer, FoodContainer, BgContainer };
