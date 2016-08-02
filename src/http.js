var config = require("./config.js");
var express = require("express");
var session = require("express-session");
exports.express = express();
var http = require("http").Server(exports.express);
exports.io = require("socket.io")(http);
var client = require('./mariasql.js');
var sessionStore = new (require('./sql/sessionStore.js'))(client,604800000);

/* Session Initialisierung */
session  = session({
    store: sessionStore,
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 604800000 // week
    }
});

exports.express.use(session);
exports.io.use(require("express-socket.io-session")(session, {
    autoSave:true
}));


/* Statische Dateien ausgeben falls nötig*/
if (config.static) {
    exports.express.use(express.static(__dirname + '/../public/'));
    exports.express.get('/index.js', require('browserify-middleware')(__dirname + '/client/startup.js'));
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

/* rest und socker Services einbinden */
var auto = require('auto-loader');
execute(auto.load(__dirname + '/rest'));
execute(auto.load(__dirname + '/socket'));

/* HTTP Port Lauschen */
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
            console.log("shutdown", "http", "stopped");
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
