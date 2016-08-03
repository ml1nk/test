var config = require("./src/config.js");
process.env.NODE_ENV = config.dev ? 'development' : 'production';
var client = require("./src/mariasql.js");

client.ready.then(function(){
  new (require("./src/sql/integrity.js"))(client);

  return require("./src/http.js").ready;
}).then(function(){
  console.log("startup","finished");
});
