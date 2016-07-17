var program = require("commander");
program
    .version(require(__dirname + '/../package').version)
    .option('--dev', 'developer mode')
    .option('--no-static', 'disable serving static files')
    .option('--port [num]', 'server port - defaults to 3000', Number)
    .option('--db_port [num]', 'database port - defaults to 3306', Number)
    .option('--db_host [hostname]', 'database hostname - defaults to localhost', String)
    .option('--db_user [user]', 'database user - defaults to root', String)
    .option('--db_pas [password]', 'database password - default is empty', String)
    .option('--db_data [database]', 'database name - default is test', String)
    .parse(process.argv);

module.exports = {
    dev: program.dev ? true : false,
    port: program.port ? program.port : 3000,
    static: program["no-static"] ? false : true,
    db: {
        port: program.db_port ? program.db_port : 3306,
        host: program.db_host ? program.db_host : "localhost",
        user: program.db_user ? program.db_user : "root",
        pas: program.db_pas ? program.db_pas : "",
        data: program.db_data ? program.db_data : "test",
    }
};
