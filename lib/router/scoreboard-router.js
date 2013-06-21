var ScoreboardRouter

  , GameController = require('../controller/game-controller');

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
      .of('/scoreboard')
      .on('connection', handleConnection);
  }

  /* Init Bindings */
  function initScoreboardBindings () {
    scoreboardObserver = scoreboard.observe(handleScoreboardUpdate);
  }

  function initSocketBindings (socket) {
    socket.on('request-game', function (data) {
      emitGame();
    });
  }

  /* Handlers */
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