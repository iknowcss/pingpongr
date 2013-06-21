var GameController

  , Game = require('../model/game')
  , GameState = require('../model/game-state')
  , Scoreboard = require('../model/scoreboard')

  , game = Game({ state: GameState.ENDED })
  , scoreboard = Scoreboard(game)
  , gameNotify;

/* Private functions */
function updateScoreboard (param) {
  scoreboard.update(game);
}

function gameStateCommand (cmd) {
  return game.gameState[cmd]();
}

function pointCounterCommand (cmd) {
  if (game.gameState.equals(GameState.IN_PROGRESS)) {
    game.pointCounter[cmd]();
  }
}

/* Public functions */
GameController = {

  getTableName: function () {
    return 'Clean Room - Light blue';
  },

  getScoreboard: function () {
    return scoreboard;
  },

  setGame: function (newGame) {
    var validation;
    if (!(newGame instanceof Game) && typeof newGame === 'object') {
      newGame = Game(newGame);
    }

    validation = newGame.validate();
    if (!validation.valid) {
      throw validation.error;
    }
    
    if (gameNotify) {
      game.stopObserving(gameNotify);
    }
    game = newGame;
    gameNotify = game.observe(updateScoreboard);
    updateScoreboard(game);
  },

  newGame: function () {
    GameController.setGame(Game());
  },

  /* GameState */
  startGame: function () {
    return gameStateCommand('startGame');
  },

  endGame: function () {
    return gameStateCommand('endGame');
  },

  cancelGame: function () {
    return gameStateCommand('cancelGame');
  },

  /* PointCounter */
  pointLeft: function () {
    pointCounterCommand('pointLeft');
  },

  pointRight: function () {
    pointCounterCommand('pointRight');
  },

  undoPoint: function () {
    pointCounterCommand('undoPoint');
  },

  redoPoint: function () {
    pointCounterCommand('redoPoint');
  }

};

exports = module.exports = GameController;