define(['server/files.js','minifier'], function (files,minifier) {
  return function(input,output) {
    files = files(input,[".js",".css"]);
    for(let i=0;i<files.length;i++) {
      minifier.minify(input+files[i], {output:output+files[i],uglify:{
        compress: {
          dead_code: true,
          global_defs: {
            DEBUG: false
          },
          drop_console: true
        }
      }});
    }
  };
});
