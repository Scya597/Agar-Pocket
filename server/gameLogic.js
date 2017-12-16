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


export {
  updatePlayerPosition,
  updatePlayersBoxValue,
};
