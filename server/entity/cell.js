import Circle from './circle';

/**
 * The Cell class
 */
class Cell extends Circle {
  /**
   * @param {object} [props] - the property of Cell
   */
  constructor(props) {
    super(props);
    this.vel = props.vel;
    this.isEaten = props.isEaten;
  }

  /**
   * Use to eat other Cell and set their isEaten to true
   */
  eat() {
    console.log(this.vel);
  }
}

export default Cell;
