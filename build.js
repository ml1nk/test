var requirejs = require('requirejs');
requirejs.config({
    nodeRequire: require
});
requirejs("server/minify.js")("client/dev","client/min");
