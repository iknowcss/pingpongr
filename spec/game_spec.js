var Game = require('../lib/game'),
    GameState = require('../lib/game-state'),
    PlayerSet = require('../lib/player-set'),
    PointCounter = require('../lib/point-counter');

describe('A GameState', function () {
    
    var game;

    beforeEach(function () {
        game = new Game();
    });

    it('should initialize with valid defaults', function () {
        var validation = game.validate();
        expect(validation.valid).toBe(true);
    });

    it('should validate with valid provided components', function () {
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

    it('should not validate with invalid provided components', function () {
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