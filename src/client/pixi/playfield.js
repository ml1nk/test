var PIXI = require("pixi.js");
var playfield = require("../../shared/playfield.js");
var fields = require("../../shared/fields.json");

exports.create = function(renderer, data) {
  var i,p;
  var fields = new PIXI.Container();

  var field = new Array(data.width);
  for (i = 0; i < data.width; i++) {
    field[i] = new Array(data.height);
  }

  i = 0;
  playfield.getView(data.width, data.height, data.x, data.y, data.range, (curX, curY) => {
    field[curX][curY] = _addSprite(fields,curX,curY,data.view[i]);
    i++;
  });

  for(i=0; i<data.width;i++) {
    for(p=0; p<data.height; p++) {
      if(typeof field[i][p] === "undefined") {
        field[i][p] = _addSprite(fields,i,p,-1);
        field[i][p].filters[0].blur = 10;
      }
    }
  }

  var stage = new PIXI.Container();
  stage.addChild(fields);

  _center(fields, data.x, data.y);

  stage.scale.set(3);

  stage.x = Math.round(renderer.width/2);
  stage.y = Math.round(renderer.height/2);

  return {
    stage : stage,
    field : field
  };
};

function _center(fields,x,y) {
  fields.x = -16-x*32;
  fields.y = -16-y*32;
}

function _fieldIdToTexture(id) {
  return PIXI.loader.resources[fields[id+1].texture].texture;
}

function _addSprite(stage,x,y,id) {
  var field = new PIXI.Sprite(
    _fieldIdToTexture(id)
  );
  field.fieldId = id;
  field.x = x*32;
  field.y = y*32;
  field.width = 32;
  field.height = 32;
  field.filters = [new PIXI.filters.BlurFilter()];
  field.filters[0].blur = 0;
  stage.addChild(field);
  return field;
}
