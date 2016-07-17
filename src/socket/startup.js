var io = require("../http.js").io;
io.on('connection', function(socket) {
    console.log('a user connected');
});
console.log("test");
