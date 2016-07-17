var callbacks = [];

new Promise(function(resolve) {
  process.on('SIGTERM', resolve);
  process.on('SIGINT', resolve);
  process.on('exit', resolve);
}).then(function(){
  console.log("shutdown","started");
  exit();
});

function exit() {
  if(callbacks.length>0) {
    callbacks.pop()().then(exit);
  } else {
    console.log("shutdown","finished");
    process.exit(0);
  }
}

/*
process.on('uncaughtException', function(e) {
  console.log('Uncaught Exception...');
  console.log(e.stack);
  process.exit(99);
}); */

exports.register = function(callback) {
  callbacks.push(callback);
};
