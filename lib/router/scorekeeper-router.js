var ScorekeeperRouter

  , ValidationError = require('../../lib/validation/validation-error')
  , GameController = require('../controller/game-controller')
  , Game = require('../model/game');

ScoreboardRouter = function (server, options) {
    
    /* Private variables */
    var io
      , namespace
      , scoreboard
      , scoreboardObserver
      , currentGameJSON;

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
    }

    /* Request handlers */
    function handleRequestGame () {
        emitGame();
    }

    /* Create handlers */
    function handleCommandCreate (data) {
        try {
            GameController.setGame(data);
        } catch (e) {
            emitError(e);
        }
    }

    /* Command handlers */
    function handleCommandState (data) {
        var validTransition;
        switch (data) {
            case 'start':
                validTransition = GameController.startGame();
                break;
            case 'end':
                validTransition = GameController.endGame();
                break;
            case 'cancel':
                validTransition = GameController.cancelGame();
                break;
            default:
                return;
        }
        if (!validTransition) {
            emitError('Cannot ' + data + ' game that is currently ' + 
                currentGameJSON.state);
        }
    }

    /* Other Handlers */
    function handleScoreboardUpdate (gameJSON) {
        currentGameJSON = gameJSON;
        emitGame();
    }

    function handleConnection (socket) {
        initSocketBindings(socket);
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