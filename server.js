var config = require("./src/cmd.js")(__dirname, process.argv);
process.env.NODE_ENV = config.dev ? 'development' : 'production';

var Client = require('mariasql');
var c = new Client({
  host: config.db.host,
  user: config.db.user,
  password: config.db.pas,
  db: config.db.data
});


var browserify = require('browserify-middleware');
var express = require("express");
var app = express();
http = require("http").Server(app);
io = require("socket.io")(http);


io.on('connection', function(socket) {
    console.log('a user connected');
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});

app.use(express.static(__dirname + '/public/'));
app.get('/index.js', browserify('./src/client/startup.js'));


process.on('SIGINT', function () {
  console.log("shutdown - http")
  http.close(function () {
    console.log("shutdown - mariasql")
    if(!c.connected) {
      console.log("shutdown - mariasql - already down")
      process.exit(0);
    } else {
      c.on("end",function(){
        console.log("shutdown - mariasql - end")
        process.exit(0);
      });
      c.on("close",function(){
        console.log("shutdown - mariasql - close")
        process.exit(0);
      });
      c.end();
    }
  });
});
