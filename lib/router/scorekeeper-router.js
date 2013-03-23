var ScorekeeperRouter

  , GameController = require('../controller/game-controller')
  , Game = require('../model/game');

ScoreboardRouter = function (server, options) {
    
    /* Private variables */
    var io
      , namespace
      , scoreboard
      , scoreboardObserver;

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
        GameController.setGame(data);
    }

    /* Command handlers */
    function handleCommandState (data) {
        switch (data) {
            case 'start':
                GameController.startGame();
                break;
            case 'end':
                GameController.endGame();
                break;
            case 'cancel':
                GameController.cancelGame();
                break;
        }
    }

    /* Other Handlers */
    function handleScoreboardUpdate (gameJSON) {
        emitGame(gameJSON);
    }

    function handleConnection (socket) {
        initSocketBindings(socket);
        emitGame();
    }

    /* Emitters */
    function emitGame (gameJSON) {
        if (!gameJSON) {
            gameJSON = scoreboard.toJSON();
        }
        namespace.emit('game', gameJSON);
    }

    // initialize
    init.call(this, server, options);

};

exports = module.exports = {

    listen: function (server, options) {
        return new ScoreboardRouter(server, options);
    }

};