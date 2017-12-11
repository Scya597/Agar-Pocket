import uuid from 'uuid/v1';

import Cell from './cell';

class Player {
  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.mousePos = { x: 100, y: 100 };
    this.cellList = [new Cell({
      mass: 10,
      pos: { x: 100, y: 100 },
      id: uuid(),
      color: 0x111111,
      vel: { x: 0, y: 0 },
      isEaten: false,
    })];
  }

  updateCellList() {
    console.log(this.id);
  }

  isDead() {
    return this.cellList.size();
  }
}

export default Player;
