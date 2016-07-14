function cmd(dirname, argv) {
    var program = require("commander");
    program
        .version(require(dirname + '/package').version)
        .option('-d, --dev', 'developer mode')
        .parse(argv);
    return {
        dev : program.dev ? true : false
    };
}
module.exports = cmd;
