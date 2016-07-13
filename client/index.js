requirejs.config({
  paths: {
    "lib/socket.io": '/socket.io/socket.io',
    "client": './amd'
  },
  shim: {
      'client/lib/phaser': {
          exports: 'Phaser'
      },
      'client/lib/jquery': {
          exports: 'jQuery'
      },
      'client/lib/materialize': {
         deps: ['client/lib/jquery']
      }
  }
});

require(["client/index"]);
