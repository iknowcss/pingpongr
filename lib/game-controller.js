var GameController

  , Game = require('./game')
  , GameState = require('./game-state')
  , Scoreboard = require('./scoreboard')

  , game = Game({ state: GameState.ENDED })
  , scoreboard = Scoreboard(game)
  , gameNotify;

/* Private functions */
function updateScoreboard (param) {
    scoreboard.update(game);
}

function gameStateCommand (cmd) {
    game.gameState[cmd]();
}

function pointCounterCommand (cmd) {
    if (game.gameState.equals(GameState.IN_PROGRESS)) {
        game.pointCounter[cmd]();
    }
}

/* Public functions */
GameController = {

    getScoreboard: function () {
        return scoreboard;
    },

    setGame: function (newGame) {
        if (gameNotify) {
            game.stopObserving(gameNotify);
        }
        game = newGame;
        gameNotify = game.observe(updateScoreboard);
        updateScoreboard(game);
    },

    /* GameState */
    startGame: function () {
        gameStateCommand('startGame');
    },

    endGame: function () {
        gameStateCommand('endGame');
    },

    cancelGame: function () {
        gameStateCommand('cancelGame');
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