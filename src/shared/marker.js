module.exports = () => {
  var obj = {};

  function add(key) {
    if(obj.hasOwnProperty(key)) {
      return false;
    } else {
      obj[key] = null;
      return true;
    }
  }

  function remove(key) {
    if(obj.hasOwnProperty(key)) {
      delete obj[key];
      return  true;
    } else {
      return false;
    }
  }

  function has(key) {
    return obj.hasOwnProperty(key);
  }
};
