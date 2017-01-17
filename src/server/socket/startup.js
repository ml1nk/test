var io = require("../http.js").io;
var playfield = require("../../shared/playfield.js");
var test = require("./test.json");

io.on('connection', function(socket) {
    console.log('login:',socket.id);


    socket.on('init', (data,fn) => {

      var view = [];
      playfield.getView(10,10,5,2,5,(curX, curY) => {
        view.push(test[curX][curY]);
      });

      console.log("got init:", data);
      fn({
        x : 5,
        y : 2,
        width : 10,
        height : 10,
        range : 5,
        view : view
      });
    });

});

io.on('disconnect', function(socket) {
    console.log('logout:',socket.id);
});



io.on('position', function(socket){
  socket.broadcast.emit('position');
});
