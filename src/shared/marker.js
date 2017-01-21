module.exports = () => {
  var obj = {};

  function add(x,y) {
    var key = x+":"+y;
    if(obj.hasOwnProperty(key)) {
      return false;
    } else {
      obj[key] = null;
      return true;
    }
  }

  function remove(x,y) {
    var key = x+":"+y;
    if(obj.hasOwnProperty(key)) {
      delete obj[key];
      return  true;
    } else {
      return false;
    }
  }

  function has(x,y) {
    var key = x+":"+y;
    return obj.hasOwnProperty(key);
  }

  function list() {
    var arr = [];
    for(var key in obj) {
      arr.push(key.split(":"));
    }
    return arr;
  }

  return {
    add : add,
    remove : remove,
    has : has,
    list : list
  };
};
