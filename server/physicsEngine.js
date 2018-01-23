import uuid from 'uuid/v1';

import Food from './entity/food';

// leaving these vector helper functions here because resolveCollisions()
// would be too ugly component-wise.
// Move them into function scope if necessary.
const vector2 = (function() {

  const make = (x, y) => {
    return { x: x, y: y };
  };

  const sum = (u, v) => {
    return {
             x: u.x + v.x,
             y: u.y + v.y
    };
  };

  const difference = (u, v) => {
    return {
             x: u.x - v.x,
             y: u.y - v.y
    };
  };

  const scale = (u, a) => {
    return {
             x: u.x*a,
             y: u.y*a
    };
  };

  const divide = (u, a) => {
    // no checks for a == 0
    return scale(u, 1/a);
  };

  const dot = (u, v) => {
    return u.x*v.x + u.y*v.y;
  };

  const norm = (u) => {
    return Math.sqrt(dot(u, u));
  };

  const unit = (u) => {
    // no safety checks for zero vector.
    return scale(u, 1/norm(u));
  };

  const unitNormal = (u) => {
    const uu = unit(u);
    return make(-uu.y, uu.x);
  }

  const project = (u, v) => {
    // projects u onto v. Also no checks for zero vector.
    return scale(
                  v,
                  dot(u, v)/dot(v, v)
    );
  };

  return {
    make: make,
    sum: sum,
    difference: difference,
    scale: scale,
    divide: divide,
    dot: dot,
    norm: norm,
    unit: unit,
    unitNormal: unitNormal,
    project: project
  }

})();

const countTwoCellDistance = (cellA, cellB, dtx, dty) =>
  Math.sqrt((((cellA.pos.x + (cellA.vel.x * dtx)) - (cellB.pos.x)) ** 2)
  + (((cellA.pos.y + (cellA.vel.y * dty)) - (cellB.pos.y)) ** 2));

const checkTwoCellWillTouched = (cellA, cellB, dtx, dty, epsilon) => {
  epsilon = epsilon || 0;
  if (countTwoCellDistance(cellA, cellB, dtx, dty) < (cellA.getRadius() + cellB.getRadius()) + epsilon) {
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

const resolveCollisions = (cellList) => {

  // possibly aesthetically pleasing to have a small gap between cells?
  // otherwise just set this to 0.
  const epsilon = 1;

  const project = (cellA, cellB) => {

    const d = vector2.difference(cellB.pos, cellA.pos);
    const rA = cellA.getRadius();
    const rB = cellB.getRadius();

    const offset = (rA + rB - vector2.norm(d)) + epsilon;
    const vRel = vector2.difference(cellB.vel, cellA.vel);
    const ratio = cellA.mass/(cellA.mass + cellB.mass);

    // these might crash things if two cells somehow end up
    // *exactly* at the same location, but hopefull the timestep is
    // small enough for that never to happen.
    //
    // (or i could write checks. but i'm lazy.)
    const u = vector2.unit(d);
    const n = vector2.unitNormal(d);

    cellB.pos = vector2.sum(cellB.pos, vector2.scale(u, offset*ratio));
    cellA.pos = vector2.sum(cellA.pos, vector2.scale(u, offset*(ratio-1)));

    cellB.vel = vector2.sum(
                  cellB.vel,
                  vector2.scale(
                    vector2.project(vRel, u),
                    -ratio
                  )
                );
    cellA.vel = vector2.sum(
                  cellA.vel,
                  vector2.scale(
                    vector2.project(vRel, u),
                    1-ratio
                  )
                );

    
  }

  const maxIter = 12;
  for (let iter = 0; iter < maxIter; ++iter) {
    for (let i = 0; i < cellList.length; ++i) {
    for (let j = i+1; j < cellList.length; ++j) {
      if (checkTwoCellWillTouched(cellList[i], cellList[j], 0, 0, epsilon)) {
        project(cellList[i], cellList[j]);
      }
    }}
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

    resolveCollisions(player.cellList);
    player.cellList.forEach((cell) => {
      checkCellTouchBorderAndMove(cell, setting, dtx, dty);
    });
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
