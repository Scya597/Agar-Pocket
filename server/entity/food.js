import Circle from './circle';

class Food extends Circle {
  constructor(props) {
    super(props);
    this.isEaten = props.isEaten;
  }
}

export default Food;
