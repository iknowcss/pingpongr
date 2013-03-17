var Scoreboard = require('../lib/scoreboard')
  , Game = require('../lib/game')
  , GameState = require('../lib/game-state');

describe('A Scoreboard', function () {

    var globalScoreboard;

    function doConstructWith (initArg) {
        return function () {
            globalScoreboard = Scoreboard(initArg);
        };
    }

    it('initializes with defaults', function () {
        var expectedJSON = {
                players: ['Player 1', 'Player 2'],
                score: [0, 0],
                state: GameState.ENDED
            };

        expect(doConstructWith()).not.toThrow();
        expect(globalScoreboard instanceof Scoreboard).toBe(true);
        expect(globalScoreboard.toJSON()).toEqual(expectedJSON);
    });

    it('initializes with a constructor arg', function () {
        var expectedJSON = {
                players: ['Carl', 'Steve`'],
                score: [0, 3],
                state: GameState.IN_PROGRESS
            }
          , game = Game(expectedJSON);

        expect(doConstructWith(game)).not.toThrow();
        expect(globalScoreboard instanceof Scoreboard).toBe(true);
        expect(globalScoreboard.toJSON()).toEqual(expectedJSON);
    });

    it('does not initialize with a bad constructor arg', function () {
        var badGame = [5];

        expect(doConstructWith(badGame)).toThrow();
    });

    it('notifies observers only when updated', function () {
        var scoreboard = Scoreboard()
          , game = Game()
          , gameJSON
          , spy = jasmine.createSpy('"scoreboard updated callback"')
          , callback = function (param) {
                gameJSON = param;
            };

        scoreboard.observe(spy);
        scoreboard.observe(callback);

        scoreboard.update(game);
        expect(spy.callCount).toBe(1);
        expect(gameJSON).toEqual(game.toJSON());

        game.gameState.startGame();
        scoreboard.update(game);
        expect(spy.callCount).toBe(2);
        expect(gameJSON).toEqual(game.toJSON());

        game.pointCounter.pointLeft();
        scoreboard.update(game);
        expect(spy.callCount).toBe(3);
        expect(gameJSON).toEqual(game.toJSON());

        // Game does not change
        scoreboard.update(game);
        expect(spy.callCount).toBe(3);
        expect(gameJSON).toEqual(game.toJSON());
    });

    it('returns an up-to-date JSON', function () {
        var scoreboard = Scoreboard()
          , game = Game();

        scoreboard.update(game);
        expect(scoreboard.toJSON()).toEqual(game.toJSON());

        game.gameState.startGame();
        scoreboard.update(game);
        expect(scoreboard.toJSON()).toEqual(game.toJSON());

        game.pointCounter.pointLeft();
        scoreboard.update(game);
        expect(scoreboard.toJSON()).toEqual(game.toJSON());
    });

});
