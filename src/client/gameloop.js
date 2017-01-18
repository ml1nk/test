const playfield = require("./pixi/playfield.js");
const keyboard = require("./keyboard.js");

var socket;

module.exports = (_socket) => {
  socket = _socket;
  _tick();
  requestAnimationFrame(repeat);
  function repeat() {
    playfield.render();
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
  console.log("test",output,lastdown);

  socket.emit("tick",output,(tick) => {
    console.log("tick",tick);

    var i;

    for(i=0; i<tick.fieldUpdates.length; i++) {
      playfield.updateField(tick.fieldUpdates[i].x,tick.fieldUpdates[i].y,tick.fieldUpdates[i].type);
    }

    for(i=0; i<tick.playerUpdates.length; i++) {
      playfield.updatePlayer(tick.playerUpdates[i]);
    }
    _tick();
  });
}
