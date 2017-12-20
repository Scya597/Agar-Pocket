const updatePlayerPosition = (playerList, setting) => {
  playerList.forEach((player) => {
    player.cellList.forEach((cell) => {
      cell.vel.x = player.mousePos.x - cell.pos.x;
      cell.vel.y = player.mousePos.y - cell.pos.y;
    });

    player.cellList.forEach((cell) => {
      const cellRadius = cell.getRadius();
      if ((cell.pos.x + (cell.vel.x * (1 / 60))) - cellRadius >= 0 &&
        (cell.pos.x + (cell.vel.x * (1 / 60))) + cellRadius <= setting.worldWidth) {
        cell.pos.x += cell.vel.x * (1 / 60);
      }
      if ((cell.pos.y + (cell.vel.y * (1 / 60))) - cellRadius >= 0 &&
        (cell.pos.y + (cell.vel.y * (1 / 60))) + cellRadius <= setting.worldHeight) {
        cell.pos.y += cell.vel.y * (1 / 60);
      }
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
    cellB.isEaten = true;
    cellA.mass += cellB.mass;
  } else if (Math.sqrt(((cellA.pos.x - cellB.pos.x) ** 2) +
  ((cellA.pos.y - cellB.pos.y) ** 2)) < cellB.getRadius()) {
    cellA.isEaten = true;
    cellB.mass += cellA.mass;
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
        console.log('same player');
      } else if (checkTwoPlayerBoxOverlap(playerList[i], playerList[j])) {
        checkTwoPlayerEaten(playerList[i], playerList[j]);
      }
    }
  }
};

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

export {
  updatePlayerPosition,
  updatePlayersBoxValue,
  checkAllEaten,
  removeEatenCells,
};
