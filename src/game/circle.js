class Circle {
  constructor(mass, pos, id, color) {
    this.mass = mass;
    this.pos = pos;
    this.id = id;
    this.color = color;
  }
  get r() {
    return Math.sqrt(this.mass / Math.PI);
  }
}

class Cell extends Circle {
  constructor(mass, pos, id, color, vel) {
    super(mass, pos, id, color);
    this.vel = vel;
    this.isEaten = false;
  }
}

class Food extends Circle {
  constructor(mass, pos, id, color) {
    super(mass, pos, id, color);
    this.isEaten = false;
  }
}

export { Circle, Cell, Food };
