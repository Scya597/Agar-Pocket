const updateClientPos = (playerList, setting) => {
  playerList.forEach((player) => {
    if (!player.theta) return;
    if ((player.x + (setting.velocity * Math.cos(player.theta))) - setting.circleRadius >= 0 &&
      player.x + (setting.velocity * Math.cos(player.theta)) +
      setting.circleRadius <= setting.worldWidth) {
      player.x += setting.velocity * Math.cos(player.theta);
    }

    if ((player.y + (setting.velocity * Math.sin(player.theta))) - setting.circleRadius >= 0 &&
      player.y + (setting.velocity * Math.sin(player.theta)) +
      setting.circleRadius <= setting.worldHeight) {
      player.y += setting.velocity * Math.sin(player.theta);
    }
  });
};

const cons = () => {
  console.log('ha');
};

export {
  updateClientPos,
  cons,
};
