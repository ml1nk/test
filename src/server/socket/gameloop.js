var field = require("./test.json");
var players = {};
var playerCount = 0;

var lastTick, tickPlayerData, tickPlayerCount;
tickReset();

exports.add = (socket,x,y,speed,sight,subField) => {
  players[socket.id] = {
    socket : socket,
    x : x,
    y : y,
    speed : speed,
    sight : sight,
    subField : subField
  };
  playerCount++;
  socket.on("tick",(data,fn) => {
    tickPlayerData[socket.id] = {
      data : data,
      fn : fn
    };
    tickPlayerCount++;
    if(tickPlayerCount == playerCount) {
      tickReady();
    }
  });
};

exports.remove = (id) => {
  playerCount--;
  delete players[id];
};

function tickReady() {
  var past = Date.now()-lastTick;
  if(past<=1000) {
    setTimeout(tick,past);
  } else {
    console.warn("tick take too long",past);
    tick();
  }
}

function tickReset() {
  lastTick = Date.now();
  tickPlayerData = {};
  tickPlayerCount = 0;
}


function tick() {
  tickReset();
  


}
