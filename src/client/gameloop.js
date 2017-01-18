const playfield = require("./pixi/playfield.js");
const keyboard = require("./keyboard.js");

var players = {};

module.exports = (renderer, stage, field, socket, stats) => {
  _tick(stage, field, socket, stats,renderer);
  requestAnimationFrame(repeat);
  function repeat() {
    _gameloop(renderer, stage);
    requestAnimationFrame(repeat);
  }
};


function _gameloop(renderer, stage) {
  //var test = Date.now();
  renderer.render(stage);
  //console.log("render",Date.now()-test);
}

function _tick(stage, field, socket, stats) {

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
      playfield.updateField(field[tick.fieldUpdates[i].x][tick.fieldUpdates[i].y],tick.fieldUpdates[i].type);
    }

    for(i=0; i<tick.playerUpdates.length; i++) {
      if(!players.hasOwnProperty(tick.playerUpdates[i].playerId)) {
        players[tick.playerUpdates[i].playerId] = playfield.addPlayer(stage, tick.playerUpdates[i].stats.x, tick.playerUpdates[i].stats.y);
      } else {
        playfield.updatePlayer(players[tick.playerUpdates[i].playerId], tick.playerUpdates[i].stats.x, tick.playerUpdates[i].stats.y);
      }
    }
    _tick(stage, field, socket, stats);
  });
}
