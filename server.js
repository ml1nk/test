var config = require("./src/config.js");
process.env.NODE_ENV = config.dev ? 'development' : 'production';
require("./src/mariasql.js").ready.then(function(){
  return require("./src/http.js").ready;
}).then(function(){
  console.log("startup","finished");
});
