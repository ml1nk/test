var config = require("./config.js");


var pool = new(require('./sql/pool.js'))(function(){
  return new Promise(function(resolve, reject){
    var _closed = false;
    var _opened = false;
    var c = new (require('mariasql'))();

    c.on("ready",function(){
      _opened=true;
      resolve({
        dispose : dispose,
        closed : closed,
        public : {
          query : query
        }
      });
    }); // Verbindung hergestellt
    c.on("error",function(error){if(_opened){_closed = true;} else { reject(error);} }); // Verbindungsfehler
    c.on("close",function(error){_closed = true; }); // Verbindung getrennt

    c.connect({
      host: config.db.host,
      user: config.db.user,
      password: config.db.pas,
      db: config.db.data
    });

    function dispose() {
      return new Promise(function(resolve, reject){
        c.on("close",function(){resolve(c);});
        c.end();
      });
    }

    function query(sql, data) {
        return new Promise(function(resolve, reject) {
          c.query(sql, data, function(err, rows) {
              if(err) {
                reject(err);
                return;
              }
              var result = {
                numRows : rows.info.numRows,
                affectedRows : rows.info.affectedRows,
                insertId : rows.info.insertId
              };
              delete rows.info;
              result.rows = rows;
              resolve(result);
            });
        });
    }

    function closed() {
      return _closed;
    }
  });
},100);

exports.claim = pool.claim.bind(pool);

exports.ready = new Promise(function(resolve, reject) {
    pool.claim().then(function(db){
      require('./shutdown.js').register("mariasql", function() {
        return pool.dispose();
      });
      db.free();
      resolve();
    });
});


exports.query = function(sql, data) {
  var _db;
  return pool.claim().then(function(db){
    _db = db;
    return db.con.query(sql,data);
  }).then(function(result){
    _db.free();
    return result;
  });
};


/* SQL Dateien aus dem Dateisystem importieren */
exports.import = function(file) {
    console.log("mariasql", "import", file);
    return exports.claim().then(function(db) {
        return new Promise(function(resolve, reject) {
            var lr = new(require('line-by-line'))(
                __dirname + "/../../private/sql/" + file, {
                    encoding: 'utf8',
                    skipEmptyLines: true
                });

            lr.on('error', function(err) {
                console.log("mariasql", "import", file, "failed");
                db.free();
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
                    db.con.query(templine).then(function() {
                        lr.resume();
                    });
                    templine = "";
                } else {
                    lr.resume();
                }
            });
            lr.on('end', function() {
                db.free();
                resolve();
            });
        });
    });
};
