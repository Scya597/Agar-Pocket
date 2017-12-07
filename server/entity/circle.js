class Circle {
  constructor(props) {
    this.mass = props.mass;
    this.pos = props.pos;
    this.id = props.id;
    this.color = props.color;
  }

  getRadius() {
    return this.mass;
  }
}

export default Circle;
