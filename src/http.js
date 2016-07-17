var config = require("./config.js");
var express = require("express");
exports.express = express();
var http = require("http").Server(exports.app);
exports.io = require("socket.io")(http);

if (config.static) {
    exports.express.use(express.static(__dirname + '/../public/'));
    exports.express.get('/index.js', require('browserify-middleware')(__dirname + '/client/startup.js'));
}

exports.rest = express.Router();
exports.express.use('/rest', exports.rest);


var resolve;
var reject;
exports.ready = new Promise(function(Resolve, Reject) {
    resolve = Resolve;
    reject = Reject;
});

// rest/socket entries needs to be loaded before http server starts listening
var auto = require('auto-loader');
execute(auto.load(__dirname + '/rest'));
execute(auto.load(__dirname + '/socket'));


http.listen(config.port, function() {
    require('./shutdown.js').register(shutdown);
    console.log("startup", "http", "started");
    resolve();
}).on("error", function(err) {
    console.log("startup", "http", "failed", err);
    reject();
});


function shutdown() {
    return new Promise(function(resolve) {
        http.close(function() {
            console.log("shutdown", "mariasql", "stopped");
            resolve();
        });
    });
}



function execute(obj) {
    for (var k in obj) {
        if (typeof obj[k] == "object" && obj[k] !== null) {
            execute(obj[k]);
        } else {
            obj[k]();
        }
    }
}
