module.exports = class {
    constructor(con,config) {
      this.config = config;
      this.con = con;
      this._ready = this.hasTables().then(function(hasTables){
          if(!hasTables) {
            // Installation + Erster Eintrag
            console.info("sql/integrity","install");
            return this.con.import("install.sql").then(function(){
                return this.updateVersionInfo(this.config.version);
            }.bind(this));
          } else {
            return this.getLastVersion().then(function(lastVersion){
                var version = this.config.version;
                // Keine Veränderung
                if(lastVersion.database==version.database && lastVersion.server==version.server) {
                    return Promise.resolve();
                } else {
                    return this.checkVersion(lastVersion,version).then(function() {
                        return this.updateVersionInfo(version);
                    }.bind(this));
                }
            }.bind(this));
          }
      }.bind(this));
    }

    /*
     * Überprüft ob auf der gewählten Datenbank bereits Tabellen liegen
     */
    hasTables() {
      return new Promise(function(resolve, reject){
        this.con.query("show tables").then(function(rows) {
          resolve(rows.length>0);
        });
      }.bind(this));
    }

    /*
     * Gibt die zuletzt verwendete Version zurück
     */
    getLastVersion() {
      return new Promise(function(resolve, reject){
        this.con.query("SELECT `database`, `server` from version ORDER BY id DESC LIMIT 1").then(function(rows) {
          if(rows.length===0) {
            reject("Missing row in the table 'version'. The database is probably broken.");
          } else {
            resolve(rows[0]);
          }
        });
      }.bind(this));
    }

    /*
     * Vergleicht die zuletzt verwendete Version des Servers mit der gerade startenden Version
     * => Falls erlaubt wird ein Datenbankupdate eingeleitet
     */
    checkVersion(lastVersion,version) {
      if(lastVersion.server<version.server) {
          console.info("sql/integrity","-","server on newer version:", lastVersion.server, "->", version.server);
      } else if(lastVersion.server<version.server) {
          console.info("sql/integrity","-","server on older version:", lastVersion.server, "->", version.server);
      }
      if(lastVersion.database>version.database) {
        return Promise.reject("The server expected an older database version: "+lastVersion.database+" > "+version.database);
      } else if(lastVersion.database<version.database) {
        if(this.config.db.auto) {
          return this.autoupdate(lastVersion.database,version.database);
        } else {
          return Promise.reject("Please enable the autoupdate to update your database: "+lastVersion.database+" < "+version.database);
        }
      } else {
        return Promise.resolve();
      }
    }

    /*
     * Führt ein Update der Datenbankversion von einer bestimmten Version zu einer bestimmten Version durch
     */
    autoupdate(fromVersion, toVersion) {
        console.info("sql/integrity","autoupdate", lastVersion.database, "->", version.database);
        return new Promise(function(resolve){
          this._autoupdate(resolve, fromVersion, toVersion);
        }.bind(this));
    }

    _autoupdate(resolve, fromVersion, toVersion) {
      if(fromVersion===toVersion) {
        resolve();
        return;
      }
      this.con.import("update/"+(fromVersion++)+"-"+fromVersion+".sql").then(function(){
        this._autoupdate(resolve,fromVersion,toVersion);
      }.bind(this));
    }

    /*
     * Bei jeder Änderung der Datenbank- und/oder Serverversion soll ein neuer Eintrag mit der aktuellen Version angelegt werden,
     * beim nächsten Start dient dieser als Referenz für die zuletzt aktive Version des Servers
     */
    updateVersionInfo(version) {
      return new Promise(function(resolve, reject){
        this.con.query("INSERT INTO version (`database`,`server`,`creation`) VALUES(:database,:server,:creation)",{
          database : version.database,
          server : version.server,
          creation :  Math.round((new Date()).getTime()/1000)
        }).then(function() {
          resolve();
        });
      }.bind(this));
    }

    ready() {
      return this._ready;
    }

};
