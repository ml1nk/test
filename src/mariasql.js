var config = require("./config.js");
var client = require('mariasql');

var c = new client();

exports.ready = new Promise(function(resolve, reject) {
    c.on("error",function(err){
      console.log("startup","mariasql","failed",err);
      reject();
    });
    c.on("ready",function(){
        require('./shutdown.js').register(shutdown);
        console.log("startup","mariasql","started");
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
  return new Promise(function(resolve){
    c.on("close",function(){
      console.log("shutdown","mariasql","stopped");
      resolve();
    });
    c.end();
  });
}

/* Methoden für den Datenbankzugriff */
exports.query = function(sql,data){
  return new Promise(function(resolve, reject){
    c.query(sql,data, function(err, rows) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
