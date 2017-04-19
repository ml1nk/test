var config = require("./config.js");
var express = require("express");
exports.express = express();
var http = require("http").Server(exports.express);
exports.io = require("socket.io")(http);

/* Statische Dateien ausgeben falls nötig*/
if (config.static) {
    exports.express.use(express.static(__dirname + '/../../public/'));
}

/* Routing vom rest vorbereiten */
exports.rest = express.Router();
exports.express.use('/rest', exports.rest);

var resolve;
var reject;
exports.ready = new Promise(function(Resolve, Reject) {
    resolve = Resolve;
    reject = Reject;
});

require("./socket/startup.js");

/* HTTP Port Lauschen */
http.listen(config.port, function() {
    resolve();
}).on("error", function(err) {
    reject(err);
});

function execute(obj) {
    for (var k in obj) {
        if (typeof obj[k] == "object" && obj[k] !== null) {
            execute(obj[k]);
        } else {
            obj[k]();
        }
    }
}
