(function () {

    var root = this

      , ScorekeeperClient;

    ScorekeeperClient = function (options) {

        function init (options) {

        }

        this.connect = function () {
            
        };

        init.call(this, options);

    };

    root.ScorekeeperClient = function (options) {
        return new ScorekeeperClient(options);
    };

    root.ScorekeeperClient.prototype = ScorekeeperClient.prototype = {
        constructor: ScorekeeperClient
    };

}).call(this);
