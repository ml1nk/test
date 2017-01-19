const PIXI = require("pixi.js");
const playfield = require("../../shared/playfield.js");
const fieldTypes = require("../../shared/fieldTypes.json");
const resolution = 64;
const blurlevel = 20;
const renderer = _renderer();
const stage = new PIXI.Container();
const stageField = new PIXI.Container();
const players = {};

var fieldSprite, fieldType, width, height, myPlayerId;
stage.addChild(stageField);
_centerStage();

exports.ready = _loadTextures();
exports.start = _start;

function _renderer() {
  // WebGLRenderer CanvasRenderer
  var renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);
  renderer.view.style.position = "absolute";
  renderer.view.style.display = "block";
  renderer.autoResize = true;
  document.body.appendChild(renderer.view);
  return renderer;
}

function _loadTextures() {
  var textures = [];
  for(var i=0; i<fieldTypes.length; i++) {
    if(i!=0) {
      textures.push(fieldTypes[i].inside.texture);      
    }
    textures.push(fieldTypes[i].outside.texture);
  }
  textures.push("images/explorer.png");
  return new Promise((resolve, reject) => {
    PIXI.loader.add(textures).load(() => { resolve(); });
  });
}

function _start(_width, _height, _myPlayerId) {
  var i, p;
  fieldSprite = [];
  fieldType = [];
  for (i = 0; i < _width; i++) {
    fieldSprite.push(new Array(_height));
    fieldType.push(new Array(_height).fill(0));
  }
  for(i=0; i<_width;i++) {
    for(p=0; p<_height; p++) {
        fieldSprite[i][p] = _addField(i,p);
    }
  }
  width = _width;
  height = _height;
  myPlayerId = _myPlayerId;
}

function _centerStage() {
  //stage.x = Math.round(renderer.width/2);
  //stage.y = Math.round(renderer.height/2);
}

function _centerPlayer(x,y) {
  stageField.x = Math.round(renderer.width/2)-(resolution/2)-x*resolution;
  stageField.y = Math.round(renderer.height/2)-(resolution/2)-y*resolution;
}

function _addField(x,y) {
  var sprite = new PIXI.Sprite(
    PIXI.loader.resources[fieldTypes[0].outside.texture].texture
  );
  sprite.x = x*resolution;
  sprite.y = y*resolution;
  sprite.width = resolution;
  sprite.height = resolution;
//  sprite.filters = [new PIXI.filters.BlurFilter()];
//  sprite.filters[0].blur = blurlevel;
  stageField.addChild(sprite);
  return sprite;
}

exports.updateField = (x,y,type,inside) => {
  fieldSprite[x][y].texture = PIXI.loader.resources[fieldTypes[type][inside ? "inside" : "outside"].texture].texture;
  fieldType[x][y] = type;
};

exports.updatePlayer = (player) => {
  if(!players.hasOwnProperty(player.playerId)) {
    players[player.playerId] = _addPlayer(player.stats.x, player.stats.y);
  } else {
    _updatePlayer(player.playerId,player.stats.x, player.stats.y);
  }
  if(player.playerId === myPlayerId) {
    _centerPlayer(player.stats.x, player.stats.y);
  }
};

function _addPlayer(x, y) {
  var player = new PIXI.Sprite(PIXI.loader.resources["images/explorer.png"].texture);
  player.x = x*resolution;
  player.y = y*resolution;
  player.width = resolution;
  player.height = resolution;
  stageField.addChild(player);
  return player;
}

function _updatePlayer(playerId, x, y) {
  players[playerId].x = x*resolution;
  players[playerId].y = y*resolution;
}
/*
exports.removePlayer = (stage, player) => {
  stage.removeChild(player);
};*/

exports.render = () => {
  var time = Date.now();
  renderer.render(stage);
  console.log("time",Date.now()-time);
};
