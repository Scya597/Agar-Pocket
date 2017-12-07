// import Cell from './cell';

class Player {
  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.cellArr = [];
  }

  updateCellArr() {
    console.log(this.id);
  }

  isDead() {
    return this.cellArr.size();
  }
}

export default Player;
