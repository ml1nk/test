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
