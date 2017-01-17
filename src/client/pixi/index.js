var PIXI = require("pixi.js");

var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
document.body.appendChild(renderer.view);

module.exports = new Promise((resolve, reject) => {
  PIXI.loader.add("images/treasureHunter.json").load(() => { resolve(renderer); });
});
