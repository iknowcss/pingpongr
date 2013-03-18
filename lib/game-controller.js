var GameController

  , Game = require('./game')
  , GameState = require('./game-state')
  , Scoreboard = require('./scoreboard')

  , game = Game({ state: GameState.ENDED })
  , scoreboard = Scoreboard(game)
  , gameNotify
  , oldGame;


function updateScoreboard () {
    scoreboard.update(game);
}

GameController = {

    getScoreboard: function () {
        return scoreboard;
    },

    setGame: function (newGame) {
        if (gameNotify) {
          // game.stopObserving(gameNotify);
        }
        game = newGame;
        gameNotify = game.observe(updateScoreboard);
        updateScoreboard();
    },

    startGame: function () {
        var success = game.gameState.startGame();
    }

};

exports = module.exports = GameController;