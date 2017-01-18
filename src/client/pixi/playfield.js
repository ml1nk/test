const PIXI = require("pixi.js");
const playfield = require("../../shared/playfield.js");
const fields = require("../../shared/fields.json");
const res = 64;

exports.create = function(renderer, data) {
  var i,p;
  var fieldContainer = new PIXI.Container();

  var field = new Array(data.width);
  for (i = 0; i < data.width; i++) {
    field[i] = new Array(data.height);
  }

  for(i=0; i<data.width;i++) {
    for(p=0; p<data.height; p++) {
        field[i][p] = _addField(fieldContainer,i,p);
    }
  }

  var stage = new PIXI.Container();
  stage.addChild(fieldContainer);

  stage.x = Math.round(renderer.width/2);
  stage.y = Math.round(renderer.height/2);

  return {
    stage : stage,
    field : field
  };
};

exports.center = (stage,x,y) => {
  var fieldContainer = stage.children[0];
  fieldContainer.x = -(res/2)-x*res;
  fieldContainer.y = -(res/2)-y*res;
};

function _fieldIdToTexture(id) {
  return PIXI.loader.resources[fields[id].texture].texture;
}

function _addField(stage,x,y) {
  var field = new PIXI.Sprite(
    _fieldIdToTexture(0)
  );
  field.type = 0;
  field.x = x*res;
  field.y = y*res;
  field.width = res;
  field.height = res;
  field.filters = [new PIXI.filters.BlurFilter()];
  field.filters[0].blur = 0;
  stage.addChild(field);
  return field;
}

exports.updateField = (sprite,type) => {
  sprite.texture = _fieldIdToTexture(type);
  sprite.type = type;
};

exports.addPlayer = (stage, x, y) => {
  var player = new PIXI.Sprite(PIXI.loader.resources["images/explorer.png"].texture);
  player.x = x*res;
  player.y = y*res;
  player.width = res;
  player.height = res;
  stage.children[0].addChild(player);
  return player;
};

exports.updatePlayer = (player, x, y) => {
  player.x = x*res;
  player.y = y*res;
};

exports.removePlayer = (stage, player) => {
  stage.removeChild(player);
};
