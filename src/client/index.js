var renderer = require("./pixi/startup.js");
var playfield = require("./pixi/playfield.js");

var io = require("socket.io-client")();

io.emit('init', "test", (data) => {
  renderer.then((renderer) => {
    var fields = playfield.create(renderer, data);
    renderer.render(fields.stage);
  });
});
