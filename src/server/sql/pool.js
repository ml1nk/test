/**
 * Represents the class managing a MySQL connection pool for node-mysql. The
 * connection pool accepts an options object which is passed to the node-mysql
 * createConnection function to establish a connection. A maximum number of
 * connections can be configured.
 *
 * @param max The maximum number of connections.
 * @param options The options with which a connection is created.
 */
function Pool(create, max) {
    // The specifig client object
    this.create = create;
    // The maximum number of connections.
    this.max = max ? max : 100;
    // The current number of connections being established.
    this._currentNumberOfConnectionsEstablishing = 0;
    // The current number of _connections.
    this._currentNumberOfConnections = 0;
    // The established _connections.
    this._connections = [];
    // Indicates whether the pool has been disposed of.
    this._disposed = false;
    this._disposed_promise = null;
    this._disposed_resolve = null;
    // The _pending operations.
    this._pending = [];
}

/**
 * Claim a managed connection. A claimed connection is not managed by the pool until
 * the connection is rebound. Once the caller has finished using the connection, rebound
 * it using the end function on the connection. This function makes it possible for a
 * transaction to function as intended.
 */
Pool.prototype.claim = function() {
    var pool = this;
    return new Promise(function(resolve, reject) {
        // Check if the pool has not been disposed of.
        if (pool._disposed) {
            reject("The pool is disposed.");
            return;
        }

        // Create function for disclaiming connection
        var result = function(connection) {
            resolve({
                  free : function() {
                    // Push the disclaiming to the connection pool.
                    pool._connections.push(connection);
                    // Update the connection pool.
                    pool._update();
                  },
                  con : connection.public
            });
        };
        pool._pending.push(result);
        // Update the connection pool.
        pool._update();
    });
};

/**
 * Dispose of the connection pool. Further queries are ignored, but all pending
 * operations are handled. Once the pending operations have been finished, the
 * connections are removed.
 */
Pool.prototype.dispose = function() {
    var pool = this;
    // Check if the pool has not been disposed of.
    if (pool._disposed === false) {
        pool._disposed = true;
        pool._disposed_promise = new Promise(function(resolve) {
            pool._disposed_resolve = resolve.bind(pool);
        });
    }
    pool._update();
    return pool._disposed_promise;
};

/**
 * Create a managed connection. A managed connection has an event handler to detect
 * connection errors and changes the termination behaviour. Once the managed connection
 * has been established, it is added to the connection pool.
 */
Pool.prototype._create = function() {
    // Check if a connection may be established.
    if (this._currentNumberOfConnections + this._currentNumberOfConnectionsEstablishing >= this.max) {
        return;
    }
    // Retrieve the pool instance.
    var pool = this;
    // Increment the current number of connections being establishing.
    pool._currentNumberOfConnectionsEstablishing++;
    // Create a connection.
    this.create().then(function(connection) {
        // Decrement the current number of connections being established.
        pool._currentNumberOfConnectionsEstablishing--;
        // Increment the current number of connections.
        pool._currentNumberOfConnections++;
        // Add the connection to the established _connections.
        pool._connections.push(connection);
        // Update the connection pool.
        pool._update();
    }, function(error) {
        // Decrement the current number of connections being established.
        pool._currentNumberOfConnectionsEstablishing--;
        // Update the connection pool.
        setTimeout(function(){
          pool._update();
        },1000);
        console.log("sql/pool", "connection error", error);
    });
};

/**
 * Update the connection pool. This method is called whenever a change in the
 * connection pool has occured, handles pending operations and establishes
 * connections.
 */
Pool.prototype._update = function() {
    // Check if a _pending query is available.
    if (this._pending.length === 0) {
        // Check if the pool has been disposed of.
        if (this._disposed === true) {
            // Iterate through each connection.
            var disposal = [];
            for (var i = 0; i < this._connections.length; i++) {
                // Terminate the connection.
                if(!this._connections[i].closed()) {
                  disposal.push(this._connections[i].dispose());
                }
            }
            // Resolve promise when all connections are disposed
            Promise.all(disposal).then(this._disposed_resolve);
            // Clear connections.
            this._connections = [];
        }
        return;
    }

    // Check if a connection is available.
    if (this._connections.length > 0) {
        var connection = this._connections.shift();
        if(connection.closed()) {
          console.log("sql/pool", "connection broken");
          this._currentNumberOfConnections--;
          this._update();
        } else {
          this._pending.shift()(connection);
        }
    }
    // Otherwise a connection may have to be established.
    else {
        this._create();
    }
};

// Export the Pool class.
module.exports = Pool;
