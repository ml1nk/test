const PIXI = require("pixi.js");
const playfield = require("../../shared/playfield.js");

function textures() {
  return ["images/explorer.png"];
}

const stage = new PIXI.Container();
const stats = {};
const sprites = {};
var base, me;

function init(_base, _me) {
  base = _base;
  me = _me;
  base.add(stage);
}

function center() {
  if(!stats.hasOwnProperty(me)) {
    stage.x = 0;
    stage.y = 0;
    base.playfield.center(0,0);
  } else {
    stage.x = base.status.centerX-(base._resolution/2)-stats[me].x*base._resolution;
    stage.y = base.status.centerY-(base._resolution/2)-stats[me].y*base._resolution;
    base.playfield.center(stage.x,stage.y);
  }
}

function update(player) {
  if(!sprites.hasOwnProperty(player.playerId)) {
    _add(player);
  } else {
    _update(player);
  }
  if(player.playerId === me) {
    center(player.stats.x, player.stats.y);
    base.playfield.center();
  }
}

function getView(width, height, callback) {
  if(!stats.hasOwnProperty(me)) {
    return;
  }
  playfield.getView(width, height, stats[me].x, stats[me].y, stats[me].sight, callback);
}

function _add(player) {
  var sprite = new PIXI.Sprite(PIXI.loader.resources["images/explorer.png"].texture);
  sprite.width = base._resolution;
  sprite.height = base._resolution;
  sprites[player.playerId] = sprite;
  _update(player);
  stage.addChild(sprite);
}

function _update(player) {
  sprites[player.playerId].x = player.stats.x*base._resolution;
  sprites[player.playerId].y = player.stats.y*base._resolution;
  sprites[player.playerId] = player.stats;
}

module.exports = {
  update : update,
  center : center,
  getView : getView,
  textures : textures,
  init : init
}
