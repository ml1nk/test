module.exports = class extends require("express-session").Store {

    constructor(con, maxAge) {
      super();
      this.maxAge = maxAge;
      this.con = con;
    }

    /*
     * store.all(callback) // Optional
     * This optional method is used to get all sessions in the store as an array.
     * The callback should be called as callback(error, sessions).
     */
    all(cb) {
        var sql = 'SELECT id, data FROM sessions';
        this.con.query(sql).then(function(rows){
          var sessions = {};
          for (i = 0; i < rows.length; i++) {
              sessions[rows[i].id] = JSON.parse(rows[i].data);
          }
          cb(null, sessions);
        });
    }


    /*
     * store.destroy(sid, callback) // Required
     * This required method is used to destroy/delete a session from the store given a session ID (sid).
     * The callback should be called as callback(error) once the session is destroyed.
     */
     destroy(session_id, cb) {
         var sql = 'DELETE FROM sessions WHERE session_id = :session_id LIMIT 1';
         this.con.query(sql, params).then(cb);
     }

     /*
      * store.clear(callback) // Optional
      * This optional method is used to delete all sessions from the store.
      * The callback should be called as callback(error) once the store is cleared.
      */
     clear(cb) {
         var sql = 'DELETE FROM sessions';
         this.con.query(sql, params).then(cb);
     }

     /*
      * store.length(callback) // Optional
      * This optional method is used to get the count of all sessions in the store.
      * The callback should be called as callback(error, len).
      */
      length(cb) {
          var sql = 'SELECT COUNT(*) FROM sessions';
          this.con.query(sql).then(function(){
            var count = rows[0] ? rows[0]['COUNT(*)'] : 0;
            cb(null, count);
          });
      }

      /*
       * store.get(sid, callback) // Required
       * This required method is used to get a session from the store given a session ID (sid).
       * The callback should be called as callback(error, session).
       * The session argument should be a session if found, otherwise null or undefined if the session was not found (and there was no error).
       * A special case is made when error.code === 'ENOENT' to act like callback(null, null).
       */
       get(session_id, cb) {
           var sql = 'SELECT data FROM sessions WHERE session_id = :session_id LIMIT 1';
           this.con.query(sql, {
               session_id: session_id
           }).then(function(rows){
             var session = rows[0] ? JSON.parse(rows[0].data) : null;
             cb(null, session);
           });
       }

       /*
        * store.set(sid, session, callback) // Optional
        * This required method is used to upsert a session into the store given a session ID (sid) and session (session) object.
        * The callback should be called as callback(error) once the session has been set in the store.
        */
        set(session_id, data, cb) {
            var sql = 'INSERT INTO sessions (session_id, expires, data) VALUES (:session_id, :expires, :data) ON DUPLICATE KEY UPDATE expires = :expires, data = :data';
            this.con.query(sql, {
                session_id: session_id,
                expires: this._expire(),
                data: JSON.stringify(data)
            }).then(cb);
        }

        /*
         * store.touch(sid, session, callback) // Recommended
         * This recommended method is used to "touch" a given session given a session ID (sid) and session (session) object.
         * The callback should be called as callback(error) once the session has been touched.
         * This is primarily used when the store will automatically delete idle sessions and this method is used to signal to the store the given session is active,
         * potentially resetting the idle timer.
         */
        touch(session_id, data, cb) {
            var sql = 'UPDATE sessions SET expires = :expires WHERE session_id = :session_id';
            this.con.query(sql, {
                expires: this._expire(),
                session_id: session_id
            }).then(cb);
        }

        /*
         * Ablaufzeitpunkt bestimmen
         */
        _expire() {
          return Math.ceil((new Date().getTime()+this.maxAge)/1000);
        }


        /*
         * Abgelaufene Sessions bereinigen
         */
        _clearExpiredSessions(cb) {
            var sql = 'DELETE FROM sessions WHERE expires < :time';
            this.con.query(sql, {
                time: Math.round(Date.now() / 1000)
            }).then(cb);
        }

};
