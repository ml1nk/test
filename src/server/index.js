var config = require("./config.js");
process.env.NODE_ENV = config.dev ? 'development' : 'production';

console.log("------- STARTING -------");
console.log("server", "mariasql");
var client = require("./mariasql.js");
client.ready.then(function(){
  console.log("server", "sql/integrity");
  return new (require("./sql/integrity.js"))(client,config).ready();
}).then(function(){
  console.log("server", "http");
  return require("./http.js").ready;
}).then(function(){
  console.log("------- RUNNING -------");
}).catch(function(err){
  console.error(err);
  process.exit(99);
});
