import uuid from 'uuid/v1';

import Food from './entity/food';

const countTwoCellDistance = (cellA, cellB, dtx, dty) =>
  Math.sqrt((((cellA.pos.x + (cellA.vel.x * dtx)) - (cellB.pos.x)) ** 2)
  + (((cellA.pos.y + (cellA.vel.y * dty)) - (cellB.pos.y)) ** 2));

const checkTwoCellWillTouched = (cellA, cellB, dtx, dty) => {
  if (countTwoCellDistance(cellA, cellB, dtx, dty) < (cellA.getRadius() + cellB.getRadius())) {
    return true;
  } else {
    return false;
  }
};

const checkCellTouchBorderAndMove = (cell, setting, dtx, dty) => {
  const cellRadius = cell.getRadius();
  // if (dt > 1 / (60 * 32)) {
  //
  // }
  if ((cell.pos.x + (cell.vel.x * dtx)) - cellRadius >= 0 &&
    (cell.pos.x + (cell.vel.x * dtx)) + cellRadius <= setting.worldWidth) {
    cell.pos.x += cell.vel.x * dtx;
  }
  if ((cell.pos.y + (cell.vel.y * dty)) - cellRadius >= 0 &&
    (cell.pos.y + (cell.vel.y * dty)) + cellRadius <= setting.worldHeight) {
    cell.pos.y += cell.vel.y * dty;
  }
};

const updatePlayerPosition = (playerList, setting) => {
  // 噴射碰撞
  // 吃東西變大碰撞
  playerList.forEach((player) => {
    player.cellList.forEach((cell) => {
      // need to consider mass to vel
      cell.vel.x = (player.mousePos.x - cell.pos.x) * (1000 / cell.mass);
      cell.vel.y = (player.mousePos.y - cell.pos.y) * (1000 / cell.mass);
    });

    const dtx = 1 / 60;
    const dty = 1 / 60;

    if (player.checkSplit) {
      for (let i = 0; i < player.cellList.length; i += 1) {
        // check split case
        let checkTime = 0;
        let timeRatioX = 1;
        let timeRatioY = 1;
        let willOverlap = false;
        while (checkTime < 5) {
          for (let j = 0; j < player.cellList.length; j += 1) {
            if (j !== i) {
              willOverlap = willOverlap ||
                checkTwoCellWillTouched(
                  player.cellList[i], player.cellList[j],
                  (dtx * timeRatioX), (dty * timeRatioY),
                );
            }
          }
          if (willOverlap === true) {
            if (timeRatioX === timeRatioY) {
              timeRatioX *= (1 / 2);
            } else {
              timeRatioY *= (1 / 2);
            }
            checkTime += (1 / 2);
          } else {
            checkTime = 5;
          }
        }

        if (willOverlap === false) {
          checkCellTouchBorderAndMove(
            player.cellList[i], setting,
            (dtx * timeRatioX), (dty * timeRatioY),
          );
        } else {
          console.log('No overlap');
        }
      }
    } else {
      // check Border Case
      player.cellList.forEach((cell) => {
        checkCellTouchBorderAndMove(cell, setting, dtx, dty);
      });
    }
  });
};

const updatePlayersBoxValue = (playerList) => {
  playerList.forEach((player) => {
    const xTop = [];
    const yTop = [];
    const xBottom = [];
    const yBottom = [];
    player.cellList.forEach((cell) => {
      xTop.push(cell.pos.x + cell.getRadius());
      yTop.push(cell.pos.y + cell.getRadius());
      xBottom.push(cell.pos.x - cell.getRadius());
      yBottom.push(cell.pos.y - cell.getRadius());
    });
    player.box.xTop = Math.max(...xTop);
    player.box.yTop = Math.max(...yTop);
    player.box.xBottom = Math.min(...xBottom);
    player.box.yBottom = Math.min(...yBottom);
  });
};

const checkTwoPlayerBoxOverlap = (playerA, playerB) => {
  if (playerA.box.xTop > playerB.box.xBottom && playerB.box.xTop > playerA.box.xBottom &&
  playerA.box.yTop > playerB.box.yBottom && playerB.box.yTop > playerA.box.yBottom) {
    return true;
  }
  return false;
};

const checkTwoCellEaten = (cellA, cellB) => {
  if (Math.sqrt(((cellA.pos.x - cellB.pos.x) ** 2) +
  ((cellA.pos.y - cellB.pos.y) ** 2)) < cellA.getRadius()) {
    if (cellA.mass > cellB.mass) {
      cellA.eat(cellB);
    }
    // cellB.isEaten = true;
    // cellA.mass += cellB.mass;
  } else if (Math.sqrt(((cellA.pos.x - cellB.pos.x) ** 2) +
  ((cellA.pos.y - cellB.pos.y) ** 2)) < cellB.getRadius()) {
    if (cellB.mass > cellA.mass) {
      cellB.eat(cellA);
    }
    // cellA.isEaten = true;
    // cellB.mass += cellA.mass;
  }
};

const checkTwoPlayerEaten = (playerA, playerB) => {
  for (let i = 0; i < playerA.cellList.length; i += 1) {
    for (let j = 0; j < playerB.cellList.length; j += 1) {
      checkTwoCellEaten(playerA.cellList[i], playerB.cellList[j]);
    }
  }
};

const checkAllEaten = (playerList) => {
  for (let i = 0; i < playerList.length; i += 1) {
    for (let j = i; j < playerList.length; j += 1) {
      if (i === j) {
        // console.log('same player');
      } else if (checkTwoPlayerBoxOverlap(playerList[i], playerList[j])) {
        checkTwoPlayerEaten(playerList[i], playerList[j]);
      }
    }
  }
};

// write this logic in player
const removeEatenCells = (playerList) => {
  playerList.forEach((player) => {
    const isEatenList = [];
    for (let i = 0; i < player.cellList.length; i += 1) {
      if (player.cellList[i].isEaten) {
        isEatenList.push(i);
      }
    }
    for (let i = isEatenList.length - 1; i >= 0; i -= 1) {
      player.cellList.splice(isEatenList[i], 1);
    }
  });
};

const generateFoods = (foodList, setting) => {
  for (let i = 0; i < 400 - foodList.length; i += 1) {
    foodList.push(new Food({
      mass: 100,
      pos: { x: Math.random() * setting.worldWidth, y: Math.random() * setting.worldHeight },
      id: uuid(),
      color: 0x111111,
      isEaten: false,
    }));
  }
};

const checkOneFoodEaten = (cell, food) => {
  if (Math.sqrt(((cell.pos.x - food.pos.x) ** 2) +
  ((cell.pos.y - food.pos.y) ** 2)) < cell.getRadius()) {
    food.isEaten = true;
    cell.mass += food.mass;
  }
};

const checkAllFoodEaten = (playerList, foodList) => {
  for (let i = 0; i < playerList.length; i += 1) {
    for (let j = 0; j < playerList[i].cellList.length; j += 1) {
      for (let k = 0; k < foodList.length; k += 1) {
        checkOneFoodEaten(playerList[i].cellList[j], foodList[k]);
      }
    }
  }
};

const removeEatenFoods = (foodList) => {
  const isEatenList = [];
  for (let i = 0; i < foodList.length; i += 1) {
    if (foodList[i].isEaten) {
      isEatenList.push(i);
    }
  }
  for (let i = isEatenList.length - 1; i >= 0; i -= 1) {
    foodList.splice(isEatenList[i], 1);
  }
};


export {
  updatePlayerPosition,
  updatePlayersBoxValue,
  checkAllEaten,
  removeEatenCells,
  generateFoods,
  checkAllFoodEaten,
  removeEatenFoods,
};
