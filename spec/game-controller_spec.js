var GameController = require('../lib/game-controller')
  , Game = require('../lib/game')
  , GameState = require('../lib/game-state')
  , Scoreboard = require('../lib/scoreboard')
  , _ = require('underscore');

describe('The GameController', function () {

    var scoreboard = GameController.getScoreboard()
      , currentGameJSON
      , callback = function (param) {
            currentGameJSON = param;
        };

    scoreboard.observe(callback);

    beforeEach(function () {
        GameController.setGame(Game());
    });

    it('updates the scoreboard when setting a new game', function () {
        var game = Game({
                players: ['Jerry', 'Dixie'],
                score: [0, 1]
            });

        GameController.setGame(game);
        expect(currentGameJSON).toEqual(game.toJSON());
    });

    it('updates the scoreboard when the game state changes', function () {
        GameController.startGame();
        expect(currentGameJSON.state).toEqual(GameState.IN_PROGRESS);
    });

    it('stops observing the current game when a new game is set', function () {
        var spy = spyOn(scoreboard, 'update').andCallThrough()
            game = Game({
                players: ['Molly', 'Tracy']
            });

        // Set the game to a game we have a reference to
        GameController.setGame(game);
        expect(spy.callCount).toBe(1);

        // Start the game and ensure scoreboard.update() is called
        GameController.startGame();
        expect(spy.callCount).toBe(2);

        // Reset spy.callCount
        spy.reset();

        // Set the game to a completely new game
        GameController.setGame(Game());
        expect(spy.callCount).toBe(1);

        // Ensure that making changes to the game we have reference to
        // which should not be active anymore does not cause 
        // scoreboard.update() to be called
        game.gameState.endGame();
        expect(spy.callCount).toBe(1);
    });

});