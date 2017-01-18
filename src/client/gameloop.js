module.exports = (renderer, stage) => {
  requestAnimationFrame(start);
  function repeat() {
    _gameloop(renderer, stage);
    requestAnimationFrame(repeat);
  }
};

function _gameloop(renderer, stage) {
  
}
