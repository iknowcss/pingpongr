var GameController = require('../lib/game-controller')
  , GameState = require('../lib/game-state');

describe('A GameController', function () {

    it('has a function to get the current game JSON', function () {
        var expectedJSON = {
                players: ['Player 1', 'Player 2'],
                score: [0, 0],
                state: GameState.ENDED
            };

        expect(GameController.getGameJSON()).toEqual(expectedJSON);

    });

    it('has a function to create new games', function () {
        var expectedJSON = {
                players: ['Player 1', 'Player 2'],
                score: [0, 0],
                state: GameState.READY
            };

        GameController.newGame();
        expect(GameController.getGameJSON()).toEqual(expectedJSON);
    });

    it('has a function to create new games with options', function () {
        var options = {
                players: ['Dan', 'Jason'],
                score: [0, 5],
                state: GameState.IN_PROGRESS
            },
            expectedJSON = options;

        GameController.newGame(options);
        expect(GameController.getGameJSON()).toEqual(expectedJSON);
    });

    xit('has a function to register scoreboards', function () {

    });

});