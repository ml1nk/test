var renderer = require("./pixi/startup.js");
var playfield = require("./pixi/playfield.js");
var gameloop = require("./gameloop.js");

var io = require("socket.io-client")();

io.emit('join', "test", (data) => {
  renderer.then((renderer) => {
    var fields = playfield.create(renderer, data);
    gameloop(renderer, fields.stage, fields.field, io, data.stats);
  });
});
