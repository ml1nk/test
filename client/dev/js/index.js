requirejs.config({
  paths: {
    "socket.io": '/socket.io/socket.io'
  }
});
if ( typeof DEBUG === "undefined" ) window.DEBUG = true;
