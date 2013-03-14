var Game = require('../lib/game'),
    GameState = require('../lib/game-state'),
    PlayerSet = require('../lib/player-set'),
    PointCounter = require('../lib/point-counter');

describe('A Game', function () {
    
    var globalGame;

    function doConstructWith (initArg) {
        return function () {
            globalGame = Game(initArg);
        };
    }

    it('should initialize with defaults', function () {
        var expectedJSON = {
                state: GameState.READY,
                score: [0, 0],
                players: ['Player 1', 'Player 2']
            };

        expect(doConstructWith()).not.toThrow();
        expect(globalGame instanceof Game).toBe(true);
        expect(globalGame.toJSON()).toEqual(expectedJSON);
    });

    it('should initialize with provided options', function () {
        var providedState = { state: GameState.IN_PROGRESS },
            providedScore = { score: [5, 0] },
            providedPlayers = { players: ['Player X', 'Player Y'];

        expect(doConstructWith()).not.toThrow();
        expect(globalGame instanceof Game).toBe(true);
        expect(globalGame.toJSON()).toEqual(expectedJSON);
    });

    xit('should validate with valid provided components', function () {
        var validGameState = new GameState(GameState.IN_PROGRESS),
            validPlayerSet = new PlayerSet(['Molly', 'Tracy']),
            validPointCounter = new PointCounter([5, 0]),
            validation;

        validation = new Game({
            gameState: validGameState
        }).validate();
        expect(validation.valid).toBe(true);

        validation = new Game({
            playerSet: validPlayerSet
        }).validate();
        expect(validation.valid).toBe(true);

        validation = new Game({
            pointCounter: validPointCounter
        }).validate();
        expect(validation.valid).toBe(true);
    });

    xit('should not validate with invalid provided components', function () {
        var invalidGameState = new GameState('foo'),
            invalidPlayerSet = new PlayerSet(['Daisy']),
            invalidPointCounter = new PointCounter([-2, 0]),
            validation;

        validation = new Game({
            gameState: invalidGameState
        }).validate();
        expect(validation.valid).toBe(false);

        validation = new Game({
            playerSet: invalidPlayerSet
        }).validate();
        expect(validation.valid).toBe(false);

        validation = new Game({
            pointCounter: invalidPointCounter
        }).validate();
        expect(validation.valid).toBe(false);
    });

});