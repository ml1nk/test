const base = require("./pixi.js");
const keyboard = require("./keyboard.js");

var socket;

module.exports = (_socket) => {
  socket = _socket;
  _tick();
  requestAnimationFrame(repeat);
  function repeat() {
    base.render();
    requestAnimationFrame(repeat);
  }
};

function _tick() {

  var output = "";
  var lastdown = keyboard.key();
  if(lastdown==37) {
    output="left";
  } else if(lastdown==38) {
    output="top";
  } else if(lastdown==39) {
    output="right";
  } else if(lastdown==40) {
    output="bottom";
  }
  socket.emit("tick",output,(tick) => {
    _tick();

    var i;

    for(i=0; i<tick.fieldUpdates.length; i++) {
      base.playfield.update(tick.fieldUpdates[i].x,tick.fieldUpdates[i].y,tick.fieldUpdates[i].type,true);
    }

    for(i=0; i<tick.playerUpdates.length; i++) {
      base.players.update(tick.playerUpdates[i]);
    }

    base.playfield.insight();
  });
}
