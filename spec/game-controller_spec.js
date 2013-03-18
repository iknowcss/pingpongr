var GameController = require('../lib/game-controller')
  , Game = require('../lib/game')
  , GameState = require('../lib/game-state')
  , Scoreboard = require('../lib/scoreboard')
  , _ = require('underscore');

describe('The GameController', function () {

    var scoreboard = GameController.getScoreboard()
      , gameJSON
      , spy = jasmine.createSpy('"scoreboard update callback"')
      , callback = function (param) {
            console.log(gameJSON = param);
        };

    scoreboard.observe(callback);
    scoreboard.observe(spy);

    beforeEach(function () {
        // GameController.setGame(Game());
    });

    xit('stops observing a game when a new game is set', function () {
        var game = Game({
                players: ['Molly', 'Tracy']
            });

        spy.reset();
        GameController.setGame(game);
        expect(spy.callCount).toBe(1);
        GameController.startGame();
        expect(spy.callCount).toBe(2);


        spy.reset();
        GameController.setGame(Game());

        game.gameState.endGame();

        expect(spy.callCount).toBe(1);
        GameController.startGame();
        expect(spy.callCount).toBe(2);
    });

    xit('updates the scoreboard when setting a new game', function () {
        var game = Game({
                players: ['Jerry', 'Dixie'],
                score: [0, 1]
            });

        GameController.setGame(game);
        expect(gameJSON).toEqual(game.toJSON());
    });

    xit('updates the scoreboard when the game state changes', function () {
        GameController.startGame();
        expect(gameJSON.state).toEqual(GameState.IN_PROGRESS);
    });

});