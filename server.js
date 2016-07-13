var requirejs = require('requirejs');
requirejs.config({
    nodeRequire: require,
    paths: {
      "server": './amd',
      "client": './client/amd'
    }
});

requirejs(['client/test']);

requirejs(['server/cmd', 'express', 'http', 'socket.io'], function (cmd, express, http, io) {
  var config = cmd(__dirname, process.argv);

  var app = express();
  http = http.Server(app);
  io = io(http);


  io.on('connection', function(socket){
    console.log('a user connected');
  });

  http.listen(3000, function(){
    console.log('listening on *:3000');
  });

  app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
  });
  app.use(express.static(__dirname + '/client/'));


});
