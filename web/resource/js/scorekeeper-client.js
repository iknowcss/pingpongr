(function () {

    var root = this
      , io = root.io
      , _ = root._

      , ScorekeeperClient

      , defaults = {
            port: 80,
            host: ':',
            namespace: '/scorekeeper'
        };

    ScorekeeperClient = function (options) {

        var socket
          , connectionString
          , ioOptions;

        function init (options) {
            options = _.extend({}, defaults, options);
            connectionString = options.host + options.port + options.namespace;
            ioOptions = options.ioOptions;
        }

        this.connect = function () {
            this.connected = false;
            this.socket = socket = io.connect(connectionString, ioOptions);
            initSocketBindings();
        };

        function initSocketBindings () {
            // socket.on('connect', connectionState.connected);
            // socket.on('game', updateSpy);
            // socket.on('error', errorSpy);
        }

        init.call(this, options);

    };

    root.ScorekeeperClient = function (options) {
        return new ScorekeeperClient(options);
    };

    root.ScorekeeperClient.prototype = ScorekeeperClient.prototype = {
        constructor: ScorekeeperClient
    };

}).call(window);