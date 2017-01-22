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

    console.log("tick-data",tick);

    var i;

    if(tick.hasOwnProperty("field")) {
      for(i=0; i<tick.field.length; i++) {
        base.playfield.update(tick.field[i].x,tick.field[i].y,tick.field[i].type,true);
      }
    }

    if(tick.hasOwnProperty("player")) {
      for(i=0; i<tick.player.length; i++) {
        base.players.update(tick.player[i]);
      }
    }

    if(tick.hasOwnProperty("player") || tick.hasOwnProperty("field")) {
      base.playfield.insight();
    }
  });
}
