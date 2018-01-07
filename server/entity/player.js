import uuid from 'uuid/v1';
import Cell from './cell';

const TWEEN = require('@tweenjs/tween.js');

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
      mass: 1000 + (500 * Math.random()),
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
    this.checkSplit = false;
  }

  /**
   * clean the Cell in the cellList that has this.isEaten == true
   */
  updateCellList() {
    console.log(this.id);
  }

  /**
   * split the cells in cellList
   */
  split() {
    const cloneCellList = [];
    this.cellList.forEach((cell) => {
      cell.mass /= 2;
      const cloneCell = new Cell({
        mass: cell.mass,
        pos: { x: cell.pos.x + 50, y: cell.pos.y + 50 },
        id: uuid(),
        color: cell.color,
        vel: { x: cell.vel.x * 1.5, y: cell.vel.y * 1.5 },
        isEaten: cell.isEaten,
      });
      cloneCellList.push(cloneCell);
    });
    cloneCellList.forEach((cloneCell) => {
      this.cellList.push(cloneCell);
    });
    // console.log(this.cellList);


    this.checkSplit = true;
  }

  /**
   * @return {boolean} - whether player is dead or not
   */
  isDead() {
    return this.cellList.size() === 0;
  }
}

export default Player;
