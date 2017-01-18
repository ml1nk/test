var playfield = require("./pixi/playfield.js");
var gameloop = require("./gameloop.js");

var socket = require("socket.io-client")();

socket.emit('join', "test", (data) => {
  playfield.ready.then(() => {
    playfield.start(data.width,data.height,data.playerId);
    gameloop(socket);
  });
});
