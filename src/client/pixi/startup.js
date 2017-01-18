var PIXI = require("pixi.js");
var fields = require("../../shared/fields.json");

var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
document.body.appendChild(renderer.view);

module.exports = new Promise((resolve, reject) => {
  var textures = [];
  for(var i=0; i<fields.length; i++) {
    textures.push(fields[i].texture);
  }
  textures.push("images/explorer.png");
  PIXI.loader.add(textures).load(() => { resolve(renderer); });
});
