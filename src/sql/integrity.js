module.exports = class {

    constructor(con) {
      console.log("test");
      con.import("install.sql");
    }
};
