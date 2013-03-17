var GameController

  , Game = require('./game')
  , GameState = require('./game-state')

  , game = Game({ state: GameState.ENDED });

GameController = {

    newGame: function (options) {
        game = Game(options);
    },

    getGameJSON: function () {
        return game.toJSON();
    }

};

exports = module.exports = GameController;