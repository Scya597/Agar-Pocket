import { Sprite, Graphics } from 'pixi.js';

function getRadius(mass) {
  return Math.sqrt(mass / Math.PI);
}

function generateCircleTexture(circle) {
  const graphics = new Graphics();
  graphics.lineStyle();
  graphics.beginFill(circle.color);
  graphics.drawCircle(0, 0, getRadius(circle.mass));
  graphics.endFill();
  return graphics.generateCanvasTexture();
}

class CellSprite extends Sprite {
  constructor(cell) {
    super(generateCircleTexture(cell));
    this.id = cell.id;
    this.flag = false;
    this.anchor.set(0.5, 0.5);
  }
  updateCell(cell) {
    this.texture = generateCircleTexture(cell);
  }
  updatePos(pos) {
    this.x = pos.x;
    this.y = pos.y;
  }
}

class FoodSprite extends Sprite {
  constructor(food) {
    super(generateCircleTexture(food));
    this.id = food.id;
    this.flag = false;
    this.anchor.set(0.5, 0.5);
  }
}


export { Sprite, CellSprite, FoodSprite };
