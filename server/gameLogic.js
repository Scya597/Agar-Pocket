const updatePlayerData = (playerList, setting) => {
  playerList.forEach((player) => {
    console.log(player.name);
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

const cons = () => {
  console.log('ha');
};

export {
  updatePlayerData,
  cons,
};
