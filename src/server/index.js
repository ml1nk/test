var config = require("./config.js");
process.env.NODE_ENV = config.dev ? 'development' : 'production';

process.on('uncaughtException', function(e) {
  console.log('Uncaught Exception...');
  console.log(e.stack);
  process.exit(99);
});

process.on('unhandledRejection', function(e) {
  console.log('Uncaught Rejection...');
  console.log(e.stack);
  process.exit(99);
});


require("./http.js").ready.then(()=>{
  console.log("Start");
});
