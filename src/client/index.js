var base = require("./pixi.js");
var gameloop = require("./gameloop.js");

var socket = require("socket.io-client")();

socket.emit('join', "test", (data) => {
  base.ready.then(() => {
    base.playfield.init(base,data.width,data.height);
    base.players.init(base,data.playerId);
    console.log("test");
    gameloop(socket);
  });
});
