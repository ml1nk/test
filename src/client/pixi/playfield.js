const PIXI = require("pixi.js");
const fieldTypes = require("../../shared/fieldTypes.json");
const marker = require("../../shared/marker.js");
const stage = new PIXI.Container();
var inside = marker();

const sprites = [];
const types = [];
var base, width, height;

function init(_base, _width, _height) {

  width = _width;
  height = _height;
  base = _base;

  var i, p;
  for (i = 0; i < _width; i++) {
    sprites.push(new Array(_height));
    types.push(new Array(_height).fill(0));
  }
  for(i=0; i<_width;i++) {
    for(p=0; p<_height; p++) {
        sprites[i][p] = _addField(i,p);
    }
  }

  base.add(stage);
}

function textures() {
  var textures = [];
  for(var i=0; i<fieldTypes.length; i++) {
    if(i!=0) {
      textures.push(fieldTypes[i].inside.texture);
    }
    textures.push(fieldTypes[i].outside.texture);
  }
  return textures;
}

function center(x, y) {
  stage.x = x;
  stage.y = y;
}

function _addField(x,y) {
  var sprite = new PIXI.Sprite(
    PIXI.loader.resources[fieldTypes[0].outside.texture].texture
  );
  sprite.x = x*base._resolution;
  sprite.y = y*base._resolution;
  sprite.width = base._resolution;
  sprite.height = base._resolution;
  stage.addChild(sprite);
  return sprite;
}

function update (x,y,type,_inside) {
  sprites[x][y].texture = PIXI.loader.resources[fieldTypes[type][_inside ? "inside" : "outside"].texture].texture;
  types[x][y] = type;
  if(_inside) {
    inside.add(x,y);
  } else {
    inside.remove(x,y);
  }
};

function insight () {
  var newInside = marker();

  base.players.getView(width,height,(x,y) => {
    newInside.add(x,y);
    inside.remove(x,y);
  });

  var nowOutside = inside.list();
  var nowInside = newInside.list();

  var i, pos;
  for(i=0; i<nowOutside.length; i++) {
    var pos = nowOutside[i];
    update(pos[0],pos[1],types[pos[0]][pos[1]],false);
  }
  for(i=0; i<nowInside.length; i++) {
    var pos = nowInside[i];
    update(pos[0],pos[1],types[pos[0]][pos[1]],true);
  }
  inside = newInside;
}

module.exports = {
  init : init,
  insight : insight,
  update : update,
  center : center,
  textures : textures
};
