var ScorekeeperRouter

  , ValidationError = require('../../lib/validation/validation-error')
  , GameController = require('../controller/game-controller')
  , GameState = require('../model/game-state')
  , Game = require('../model/game');

ScoreboardRouter = function (server, options) {
  
  /* Private variables */
  var io
    , namespace
    , scoreboard
    , scoreboardObserver
    , currentGameJSON

    , stateActions
    , pointActions;

  /* Constructor */
  function init (server, options) {
    scoreboard = GameController.getScoreboard();
    initScoreboardBindings();

    io = require('socket.io').listen(server, options);
    namespace = io
      .of('/scorekeeper')
      .on('connection', handleConnection);
  }

  /* Init Bindings */
  function initScoreboardBindings () {
    scoreboardObserver = scoreboard.observe(handleScoreboardUpdate);
  }

  function initSocketBindings (socket) {
    socket.on('request-game', handleRequestGame);
    socket.on('command-create', handleCommandCreate);
    socket.on('command-state', handleCommandState);
    socket.on('command-point', handleCommandPoint);
  }

  /* Connection handler */
  function handleConnection (socket) {
    initSocketBindings(socket);
    emitGame();
  }

  /* request-game handler */
  function handleRequestGame () {
    emitGame();
  }

  /* command-create handlers */
  function handleCommandCreate (data) {
    try {
      GameController.setGame(data);
    } catch (e) {
      emitError(e);
    }
  }

  /* command-state handlers */
  stateActions = {
    start: function () {
      return GameController.startGame();
    },

    end: function () {
      return GameController.endGame();
    },

    cancel: function () {
      return GameController.cancelGame();
    }
  };
  
  function handleCommandState (data) {
    var action = stateActions[data]
      , validTransition;

    if (!_.isFunction(action)) {
      emitError('Invalid state command "' + data + '"');
      return;
    }

    validTransition = action();
    if (!validTransition) {
      emitError('Cannot ' + data + ' game that is currently ' + 
        currentGameJSON.state);
      return;
    }
  }

  /* command-point Handlers */
  pointActions = {
    left: function () {
      GameController.pointLeft();
    },

    right: function () {
      GameController.pointRight();
    },

    undo: function () {
      GameController.undoPoint();
    },

    redo: function () {
      GameController.redoPoint();
    }
  };
  function handleCommandPoint (data) {
    var action;

    if (currentGameJSON.state !== GameState.IN_PROGRESS) {
      emitError('Cannot update score when game is not in progress');
      return;
    }

    action = pointActions[data];
    if (!_.isFunction(action)) {
      emitError('Invalid point command "' + data + '"');
      return;
    }

    action();
  }

  /* Other Handlers */
  function handleScoreboardUpdate (gameJSON) {
    currentGameJSON = gameJSON;
    emitGame();
  }

  /* Emitters */
  function emitGame () {
    if (!currentGameJSON) {
      currentGameJSON = scoreboard.toJSON();
    }
    namespace.emit('game', currentGameJSON);
  }

  function emitError (error, type) {
    var errorJSON = {};
    if (error instanceof ValidationError) {
      errorJSON.type = 'validation';
      errorJSON.errors = error.errors;
    } else if (error instanceof Error) {
      errorJSON.type = 'exception';
      errorJSON.message = error.message;
    } else if (_.isString(error)) {
      errorJSON = {};
      errorJSON.type = _.isString(type) ? type.toString() : 'exception';
      errorJSON.message = error.toString();
    }
    namespace.emit('error', errorJSON);
  }

  // initialize
  init.call(this, server, options);

};

exports = module.exports = {

  listen: function (server, options) {
    return new ScoreboardRouter(server, options);
  }

};