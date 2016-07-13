define(['commander'], function (program) {
  return function(dirname, argv) {
    program
      .version(require(dirname + '/package').version)
      //.option('-d, --dev', 'developer mode')
      .parse(argv);
    return {
    //  dev : program.dev ? true : false
    };
  };
});
