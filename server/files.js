define(['fs'], function (fs) {
  function walk(root,dir,filter) {
      var results = [];
      var list = fs.readdirSync(root+dir);
      list.forEach(function(file) {
          file = dir + '/' + file;
          var stat = fs.statSync(root+file);
          if (stat && stat.isDirectory()) {
            results = results.concat(walk(root,file,filter));
          } else {
            for(let i=0; i<filter.length; i++) {
              if(file.endsWith(filter[i])) {
                results.push(file);
                break;
              }
            }
            if(filter.length===0) {
              results.push(file);
            }
          }
      });
      return results;
  }
  return function(root,filter) {
    return walk(root,"",filter);
  };
});
