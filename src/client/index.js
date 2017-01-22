var base = require("./pixi.js");
var gameloop = require("./gameloop.js");

var socket = require("socket.io-client")();

socket.emit('join', "test", (data) => {
  base.ready.then(() => {
    console.log("join",data.id);
    base.playfield.init(base,data.width,data.height);
    base.players.init(base,data.id);
    gameloop(socket);
  });
});
