(function () {

    var root = this
      , isNode = (typeof exports !== 'undefined')
      , initExport

      , ScorekeeperClient

      , socket
      , defaults = {
            port: 80,
            host: ':',
            namespace: '/scorekeeper'
        };

    ScorekeeperClient = function (options) {

        var self = this
          , io = root.io
          , _ = root._
          , Observable = root.Observable
          , connectionString
          , ioOptions;

        function init (options) {
            options = _.extend({}, defaults, options);
            connectionString = options.host + options.port + options.namespace;
            ioOptions = options.ioOptions;
        }

        this.isConnected = function () {
            if (!socket) {
                return false;
            }
            return socket.socket.connected;
        };

        this.connect = function () {
            if (!socket) {
                socket = io.connect(connectionString, ioOptions);
                initSocketBindings();
            } else {
                socket.socket.connect();
            }
        };

        this.disconnect = function () {
            socket.disconnect();
        };

        function initSocketBindings () {
            socket.on('game', handleGame);
        }

        function handleGame (data) {
            self.notify(data);
        }

        init.call(this, options);

        _.extend(this, Observable);

    };

    initExport = function (options) {
        return new ScorekeeperClient(options);
    };

    initExport.prototype = ScorekeeperClient.prototype = {
        constructor: ScorekeeperClient
    };

    // Export the module to Node or to window depending on the context
    if (isNode) {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = initExport;
        }
        exports.ScorekeeperClient = initExport;
    } else {
        root.ScorekeeperClient = initExport;
    }

    // Get references to the necessary modules if in Node
    if (isNode) {
        root._ = require('underscore');
        root.io = require('socket.io-client');
        root.Observable = require('../../../lib/model/observable-mixin');
    }

}).call(this);