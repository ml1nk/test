exports.getView = (width,height,x,y,range,callback) => {
  var i,p,subRange,curX,curY;
  for(i=-range; i<=range; i++) {
    curX = x + i;
    if(curX < 0 || width <= curX) {
      continue;
    }
    subRange = range-Math.abs(i);
    for(p=-subRange; p<=subRange; p++) {
      curY = y + p;
      if(curY < 0 || height <= curY) {
        continue;
      }
      callback(curX,curY);
    }
  }
};

exports.getDiff = (width, height, x, y, range, field, subField) => {
  var diff = [];
  exports.getView(width, height, x, y, range, (curX, curY) => {
    if(field[curX][curY] != subField[curX][curY]) {
      subField[curX][curY] = field[curX][curY];
      diff.push({
        x : curX,
        y : curY,
        type : field[curX][curY]
      });
    }
  });
  return diff;
};

exports.applyDiff = (field, diff) => {
  for(var i=0; i<diff.length; i++) {
    field[diff[i].x][diff[i].y] = diff[i].id;
  }
};
