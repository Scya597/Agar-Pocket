import Circle from './circle';

class Cell extends Circle {
  constructor(props) {
    super(props);
    this.vel = props.vel;
    this.isEaten = props.isEaten;
  }

  eat() {
    console.log(this.vel);
  }
}

export default Cell;
