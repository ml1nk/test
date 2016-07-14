var config = require("./src/cmd.js")(__dirname, process.argv);
process.env.NODE_ENV = config.dev ? 'development' : 'production';

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
