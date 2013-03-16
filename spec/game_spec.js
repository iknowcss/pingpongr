var Game = require('../lib/game'),
    GameState = require('../lib/game-state'),
    PlayerSet = require('../lib/player-set'),
    PointCounter = require('../lib/point-counter'),
    _ = require('underscore');

describe('A Game', function () {
    
    var globalGame;

    function doConstructWith (initArg) {
        return function () {
            globalGame = Game(initArg);
        };
    }

    it('should initialize with defaults', function () {
        var expectedState = GameState.READY,
            expectedPlayers = ['Player 1', 'Player 2'],
            expectedScore = [0, 0];

        expect(doConstructWith()).not.toThrow();
        expect(globalGame instanceof Game).toBe(true);
        expect(globalGame.gameState.getState()).toBe(expectedState);
        expect(globalGame.playerSet.getPlayers()).toEqual(expectedPlayers);
        expect(globalGame.pointCounter.getScore()).toEqual(expectedScore);
    });

    it('should initialize a valid game with provided components', function () {
        var defaults = {
                state: GameState.READY,
                score: [0, 0],
                players: ['Player 1', 'Player 2']
            },
            providedState = { state: GameState.IN_PROGRESS },
            providedScore = { score: [5, 0] },
            providedPlayers = { players: ['Player X', 'Player Y'] },
            expectedJSON,
            validation;

        expectedJSON = _.extend({}, defaults, providedState);
        expect(doConstructWith(providedState)).not.toThrow();
        expect(globalGame instanceof Game).toBe(true);
        expect(globalGame.toJSON()).toEqual(expectedJSON);
        expect(globalGame.validate().valid).toBe(true);

        expectedJSON = _.extend({}, defaults, providedScore);
        expect(doConstructWith(providedScore)).not.toThrow();
        expect(globalGame instanceof Game).toBe(true);
        expect(globalGame.toJSON()).toEqual(expectedJSON);
        expect(globalGame.validate().valid).toBe(true);

        expectedJSON = _.extend({}, defaults, providedPlayers);
        expect(doConstructWith(providedPlayers)).not.toThrow();
        expect(globalGame instanceof Game).toBe(true);
        expect(globalGame.toJSON()).toEqual(expectedJSON);
        expect(globalGame.validate().valid).toBe(true);
    });

    it('should not validate with invalid provided components', function () {
        var invalidPlayerSet = { players: ['Lonely player', ''] },
            invalidPointCounter = { score: [-1, 0] },
            bothInvalid = _.extend({}, invalidPlayerSet, invalidPointCounter),
            validation;

        validation = Game(invalidPlayerSet).validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        validation = Game(invalidPointCounter).validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        validation = Game(bothInvalid).validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(2);
    });

});