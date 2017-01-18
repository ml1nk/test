var io = require("../http.js").io;
var playfield = require("../../shared/playfield.js");
var gameloop = require("./gameloop.js");
var test = require("./test.json");

io.on('connection', function(socket) {
    console.log('login:',socket.id);
    socket.on('join', (data,fn) => {
      console.log('join:',data);
      gameloop.add(socket,fn);
    });

    socket.on('disconnect', function() {
        console.log('logout:',socket.id);
        gameloop.remove(socket.id);
    });
});
