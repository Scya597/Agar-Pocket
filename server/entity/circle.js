class Circle {
  constructor(props) {
    this.mass = props.mass;
    this.pos = props.pos;
    this.id = props.id;
    this.color = props.color;
  }

  getRadius() {
    return Math.sqrt(this.mass / Math.PI);
  }
}

export default Circle;
