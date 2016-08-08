var config = require("./config.js");
var client = require('mariasql');

var c = new client();

exports.ready = new Promise(function(resolve, reject) {
    c.on("error", function(err) {
        reject(err);
    });
    c.on("ready", function() {
        require('./shutdown.js').register("mariasql",shutdown);
        resolve();
    });
});

c.connect({
    host: config.db.host,
    user: config.db.user,
    password: config.db.pas,
    db: config.db.data
});

function shutdown() {
    return new Promise(function(resolve) {
        c.on("close", function() {
            resolve();
        });
        c.end();
    });
}

/* Methoden für den Datenbankzugriff */
exports.query = function(sql, data) {
    return new Promise(function(resolve, reject) {
        c.query(sql, data, function(err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

/* SQL Dateien aus dem Dateisystem importieren */
exports.import = function(file) {
    console.log("mariasql", "import", file);
    return new Promise(function(resolve, reject) {
        var lr = new(require('line-by-line'))(
            __dirname + "/../private/sql/" + file, {
                encoding: 'utf8',
                skipEmptyLines: true
            });

        lr.on('error', function(err) {
            console.log("mariasql", "import", file, "failed");
            reject(err);
        });

        var templine = "";
        lr.on('line', function(line) {
            lr.pause();
            // Zeile ist leer oder ein Kommentar
            if (line === '' || line.substr(0, 2) === '--') {
                lr.resume();
                return;
            }
            // Mehrzeiler zusammensetzen
            templine += line;
            // Schließt einen SQL Query ab?
            if (line.trim().endsWith(";")) {
                exports.query(templine).then(function() {
                  lr.resume();
                });
                templine = "";
            } else {
                lr.resume();
            }
        });
        lr.on('end', function() {
            resolve();
        });
    });

};
