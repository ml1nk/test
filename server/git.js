module.exports = new Promise(function(resolve) {
  var result = {};
  var git = require('git-rev');
  git.long(function (str) {
    result.commit = str;
  });
  git.branch(function (str) {
    result.branch = str;
  });
  git.tag(function (str) {
    result.tag = str;
  });

  function after



});
