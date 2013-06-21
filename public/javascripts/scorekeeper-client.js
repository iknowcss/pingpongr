(function () {

  var root = this
    , isNode = (typeof exports !== 'undefined')
    , initExport

    , ScorekeeperClient

    , socket
    , defaults = {
      port    : 80,
      host    : ':',
      namespace   : '/scorekeeper'
    };

  ScorekeeperClient = function (options) {

    var self = this
      , io = root.io
      , _ = root._
      , Observable = root.Observable
      , connectionString
      , ioOptions;

    _.extend(this, Observable);

    function init (options) {
      options = _.extend({}, defaults, options);
      connectionString = options.host + options.port + options.namespace;
      ioOptions = options.ioOptions;
    }

    function initSocketBindings () {
      socket.on('game', handleGame);
      socket.on('error', handleError);
    }

    function handleGame (data) {
      self.notify('game', data);
    }

    function handleError (data) {
      self.notify('error', data);
    }

    // Connection management
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

    function socketEmit (command, data) {
      if (!self.isConnected()) {
        handleError({
          type: 'exception',
          message: 'client is not connected'
        });
      } else {
        socket.emit(command, data);
      }
    }

    function doSocketEmit (command, data) {
      return function () {
        socketEmit(command, data);
      };
    };

    // request-game
    this.refreshGame = function () {
      socketEmit('request-game');
    };

    // command-create
    this.createGame = function (gameJSON) {
      if (_.isUndefined(gameJSON)) {
        gameJSON = {};
      }
      socketEmit('command-create', gameJSON);
    };

    // command-state
    this.startGame = doSocketEmit('command-state', 'start');
    this.endGame = doSocketEmit('command-state', 'end');
    this.cancelGame = doSocketEmit('command-state', 'cancel');

    // command-point
    this.pointLeft = doSocketEmit('command-point', 'left');
    this.pointRight = doSocketEmit('command-point', 'right');
    this.undoPoint = doSocketEmit('command-point', 'undo');
    this.redoPoint = doSocketEmit('command-point', 'redo');

    init.call(this, options);

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
    root.Observable = require('../../lib/model/observable-mixin');
  }

}).call(this);