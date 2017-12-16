import uuid from 'uuid/v1';

import Cell from './cell';

/**
 * The Player class
 */
class Player {
  /**
   * @param {object} [props] - the property of Food
   */
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
    this.box = {
      xTop: 0,
      xBottom: 0,
      yTop: 0,
      yBottom: 0,
    };
  }

  /**
   * clean the Cell in the cellList that has this.isEaten == true
   */
  updateCellList() {
    console.log(this.id);
  }

  /**
   * @return {boolean} - whether player is dead or not
   */
  isDead() {
    return this.cellList.size() === 0;
  }
}

export default Player;
