var field = require("./test.json");

var width = field.length;
var height = field[0].length;

var playfield = require("../../shared/playfield.js");
var playersfunction = require("../../shared/player.js");

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
    id : playerIdCounter,
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
    if(tickPlayerCount == playerCount) {
      tickReady();
    }
  });
  fn({
    id : playerIdCounter,
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
    console.log("tick:", past);
    setTimeout(tick,200-past);
  } else {
    console.warn("tick:",past, "- too long");
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

    var data = playfield.getDiff(width, height, players[key].stats.x, players[key].stats.y, players[key].stats.sight, field, players[key].subField);
    var playerChanges = [];
    for(var socketid in players) {
      var inside = data.inside.has(players[socketid].stats.x,players[socketid].stats.y);
      if(inside && (!players[key].subPlayers.hasOwnProperty(socketid) || playersfunction.isChanged(players[key].subPlayers[socketid], players[socketid].stats))) {
        players[key].subPlayers[socketid] = Object.assign({}, players[socketid].stats);
        playerChanges.push({
          stats : players[socketid].stats,
          id : players[socketid].id
        });
      } else if(!inside && players[key].subPlayers.hasOwnProperty(socketid)) {
        playerChanges.push({
          stats : { x : -1, y : -1},
          id : players[socketid].id
        });
        delete players[key].subPlayers[socketid];
      }
    }
    var tick = {};

    if(data.diff.length>0) {
      tick.field = data.diff;
    }
    if(playerChanges.length>0) {
      tick.player = playerChanges;
    }

    tickPlayerData[key].fn(tick);
  }

  tickPlayerData = {};
  tickPlayerCount = 0;
}
