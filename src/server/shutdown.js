var services = [];

new Promise(function(resolve) {
  process.on('SIGTERM', resolve);
  process.on('SIGINT', resolve);
  process.on('exit', resolve);
}).then(function(){
  console.log("shutdown","start");
  exit();
});

function exit() {
  if(services.length>0) {
    var service = services.pop();
    console.log("shutdown","stop",service.name);
    service.callback().then(function(){
      exit();
    });
  } else {
    console.log("shutdown","complete");
    process.exit(0);
  }
}

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

exports.register = function(name, callback) {
  services.push({ name : name, callback : callback});
};
