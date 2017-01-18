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
        field[i][p] = _addField(fieldContainer,i,p,0);
    }
  }

  var stage = new PIXI.Container();
  stage.addChild(fieldContainer);

  _center(fieldContainer, data.stats.x, data.stats.y);

  stage.x = Math.round(renderer.width/2);
  stage.y = Math.round(renderer.height/2);

  return {
    stage : stage,
    field : field
  };
};

function _center(fields,x,y) {
  fields.x = -(res/2)-x*res;
  fields.y = -(res/2)-y*res;
}

function _fieldIdToTexture(id) {
  return PIXI.loader.resources[fields[id].texture].texture;
}

function _addField(stage,x,y,id) {
  var field = new PIXI.Sprite(
    _fieldIdToTexture(id)
  );
  field.fieldId = id;
  field.x = x*res;
  field.y = y*res;
  field.width = res;
  field.height = res;
  field.filters = [new PIXI.filters.BlurFilter()];
  field.filters[0].blur = 0;
  stage.addChild(field);
  return field;
}

exports.updateField = (sprite,id) => {
  sprite.texture = _fieldIdToTexture(id);
};
