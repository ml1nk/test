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
    stage.x = base._status.centerX-(base._resolution/2)-stats[me].x*base._resolution;
    stage.y = base._status.centerY-(base._resolution/2)-stats[me].y*base._resolution;
    base.playfield.center(stage.x,stage.y);
  }
}

function update(player) {
  if(!sprites.hasOwnProperty(player.id)) {
    _add(player);
  } else {
    _update(player);
  }
  if(player.id === me) {
    center();
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
  sprites[player.id] = sprite;
  _update(player);
  stage.addChild(sprite);
}

function _update(player) {
  if(player.stats.x==-1 && player.stats.y==-1) {
    _remove(player.id);
  } else {
    sprites[player.id].x = player.stats.x*base._resolution;
    sprites[player.id].y = player.stats.y*base._resolution;
    stats[player.id] = player.stats;
  }
}

function _remove(id) {
  stage.removeChild(sprites[id]);
  delete sprites[id];
  delete stats[id];
}

module.exports = {
  update : update,
  center : center,
  getView : getView,
  textures : textures,
  init : init
};
