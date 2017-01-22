const PIXI = require("pixi.js");
const players = require("./pixi/players.js");
const playfield = require("./pixi/playfield.js");

const resolution = 64;
const renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
const stage = new PIXI.Container();

renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
document.body.appendChild(renderer.view);
window.addEventListener("resize", resize);

function status() {
  return {
    width : renderer.width,
    height : renderer.height,
    centerX : Math.round(renderer.width/2),
    centerY : Math.round(renderer.height/2)
  };
}

function resize() {
  renderer.resize(window.innerWidth, window.innerHeight);
  exports._status = status();
  players.center();
}

function render() {
  //var time = Date.now();
  renderer.render(stage);
  //console.log("time",Date.now()-time);
}

function add(container) {
  stage.addChild(container);
}

function remove(container) {
  stage.removeChild(container);
}

function textures() {
  var textures = players.textures().concat(playfield.textures());
  return new Promise((resolve, reject) => {
    PIXI.loader.add(textures).load(() => { resolve(); });
  });
}

module.exports = {
  _resolution : resolution,
  _status : status(),
  render : render,
  add : add,
  remove : remove,
  ready : textures(),
  players : players,
  playfield : playfield
};
