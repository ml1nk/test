var field = require("./test.json");

var width = field.length;
var height = field[0].length;

var playfield = require("../../shared/playfield.js");
var players = {};
var playerCount = 0;
var playerIdCounter = 0;

var lastTick = Date.now();
var tickPlayerData = {};
var tickPlayerCount = 0;

exports.add = (socket,fn) => {

  var x =  5;
  var y = 2;
  var speed = 5;
  var sight = 2;

  var subField = new Array(width);
  for (var i = 0; i < width; i++) {
    subField[i] = new Array(height).fill(0);
  }

  players[socket.id] = {
    socket : socket,
    stats : {
      x : x,
      y : y,
      speed : speed,
      sight : sight
    },
    playerId : playerIdCounter,
    subField : subField,
    subPlayers : {}
  };
  playerCount++;
  socket.on("tick",(data,fn) => {
    tickPlayerCount++;
    tickPlayerData[socket.id] = {
      data : data,
      fn : fn
    };
    console.log(tickPlayerCount,playerCount);
    if(tickPlayerCount == playerCount) {
      tickReady();
    }
  });
  fn({
    playerId : playerIdCounter,
    width : width,
    height : height
  });
  playerIdCounter++;
};

exports.remove = (id) => {
  if(!players.hasOwnProperty(id)) {
    return;
  }
  playerCount--;
  delete players[id];
  if(tickPlayerData.hasOwnProperty(id)) {
    delete tickPlayerData[id];
    tickPlayerCount--;
  }
};

function tickReady() {
  var past = Date.now()-lastTick;
  if(past<=200) {
    setTimeout(tick,past);
  } else {
    console.warn("tick take too long",past);
    tick();
  }
}



function tick() {
  var key;
  lastTick = Date.now();

  for(key in tickPlayerData) {
    if(tickPlayerData[key].data == "left") {
      players[key].stats.x--;
    } else if(tickPlayerData[key].data == "right") {
      players[key].stats.x++;
    } else if(tickPlayerData[key].data == "top") {
      players[key].stats.y--;
    } else if(tickPlayerData[key].data == "bottom") {
      players[key].stats.y++;
    }
  }

  for(key in tickPlayerData) {
    var tickData = {
      fieldUpdates : playfield.getDiff(width, height, players[key].stats.x, players[key].stats.y, players[key].stats.sight, field, players[key].subField),
    };
    tickData.playerUpdates = [];
    for(var socketid in players) {
      tickData.playerUpdates.push({
        stats : players[socketid].stats,
        playerId : players[socketid].playerId
      });
    }
    tickPlayerData[key].fn(tickData);
  }

  tickPlayerData = {};
  tickPlayerCount = 0;
}
