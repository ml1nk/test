exports.isChanged = (player1, player2) => {
  return player1.x !== player2.x || player1.y !== player2.y;
};
