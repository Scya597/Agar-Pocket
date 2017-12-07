import { Sprite, Graphics } from 'pixi.js';

function generateCircleTexture(circle) {
  const graphics = new Graphics();
  graphics.lineStyle();
  graphics.beginFill(circle.color);
  graphics.drawCircle(0, 0, circle.r);
  graphics.endFill();
  return graphics.generateCanvasTexture();
}

class CellSprite extends Sprite {
  constructor(cell) {
    super(generateCircleTexture(cell));
  }
  updateCell(cell) {
    this.texture = generateCircleTexture(cell);
  }
}

class FoodSprite extends Sprite {
  constructor(food) {
    super(generateCircleTexture(food));
  }
}

export { Sprite, CellSprite, FoodSprite };

