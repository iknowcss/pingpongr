var GameController = require('../../lib/controller/game-controller')
  , Game = require('../../lib/model/game')
  , GameState = require('../../lib/model/game-state')
  , Scoreboard = require('../../lib/model/scoreboard')
  , _ = require('underscore');

describe('The GameController', function () {

    var scoreboard = GameController.getScoreboard()
      , currentGameJSON
      , spy
      , callback = function (param) {
            currentGameJSON = param;
        };

    scoreboard.observe(callback);

    beforeEach(function () {
        GameController.newGame();
        spy = spyOn(scoreboard, 'update').andCallThrough();
    });

    it('has a function to start a new game with defaults', function () {
        GameController.startGame();
        GameController.newGame();
        expect(currentGameJSON).toEqual(Game().toJSON());
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

        GameController.endGame();
        expect(currentGameJSON.state).toEqual(GameState.ENDED);

        GameController.setGame(Game());
        expect(currentGameJSON.state).toEqual(GameState.READY);

        GameController.startGame();
        GameController.cancelGame();
        expect(currentGameJSON.state).toEqual(GameState.CANCELLED);
    });

    it('does not allow point change when game is not in progress ', function () {
        GameController.pointLeft();
        GameController.pointRight();
        expect(currentGameJSON.score).toEqual([0, 0]);

        GameController.startGame();
        GameController.pointLeft();
        GameController.pointRight();
        GameController.pointRight();
        expect(currentGameJSON.score).toEqual([1, 2]);
        GameController.undoPoint();
        GameController.undoPoint();
        expect(currentGameJSON.score).toEqual([1, 0]);
        GameController.redoPoint();
        expect(currentGameJSON.score).toEqual([1, 1]);

        GameController.endGame();
        GameController.redoPoint();
        expect(currentGameJSON.score).toEqual([1, 1]);
    });

    it('updates the scoreboard when the score changes', function () {
        GameController.startGame();

        GameController.pointLeft();
        expect(currentGameJSON.score).toEqual([1, 0]);

        GameController.pointRight();
        expect(currentGameJSON.score).toEqual([1, 1]);

        GameController.undoPoint();
        expect(currentGameJSON.score).toEqual([1, 0]);

        GameController.redoPoint();
        expect(currentGameJSON.score).toEqual([1, 1]);
    });

    it('stops observing the current game when a new game is set', function () {
        var game = Game({
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