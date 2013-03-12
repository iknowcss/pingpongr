var GameState = require('../lib/game-state'),
    _ = require('underscore');

function expectNoStatusChange (initialStatus, action) {
    var success;
    gameState = new GameState({ state: initialStatus });
    success = gameState[action].call();
    expect(success).toBe(false);
    expect(gameState.getState()).toBe(initialStatus);
}

describe('A GameState', function () {
    var gameState;

    beforeEach(function () {
        gameState = new GameState();
    });

    it('should change state appropriately from game start to game end', function () {
        gameState.startGame();
        expect(gameState.getState()).toBe(GameState.IN_PROGRESS);

        gameState.endGame();
        expect(gameState.getState()).toBe(GameState.ENDED);
    });

    it('should change state appropriately from game start to game cancelled', function () {
        gameState.startGame();
        expect(gameState.getState()).toBe(GameState.IN_PROGRESS);
        
        gameState.cancelGame();
        expect(gameState.getState()).toBe(GameState.CANCELLED);
    });

    it('should not start a game when "in-progress", "cancelled", or "ended"', function () {
        expectNoStatusChange(GameState.IN_PROGRESS, "startGame");
        expectNoStatusChange(GameState.CANCELLED, "startGame");
        expectNoStatusChange(GameState.ENDED, "startGame");
    });

    it('should not cancel or end a game when "ready", "cancelled", or "ended"', function () {
        expectNoStatusChange(GameState.READY, "cancelGame");
        expectNoStatusChange(GameState.CANCELLED, "cancelGame");
        expectNoStatusChange(GameState.ENDED, "cancelGame");

        expectNoStatusChange(GameState.READY, "endGame");
        expectNoStatusChange(GameState.CANCELLED, "endGame");
        expectNoStatusChange(GameState.ENDED, "endGame");
    });

    it('should not validate when initialized with an invalid state', function () {
        var gameState,
            validation;

        gameState = new GameState({ state: {} });
        validation = gameState.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        gameState = new GameState({ state: 'foo' });
        validation = gameState.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);
    });

    it('should generate an up-to-date JSON', function () {
        var gameState = new GameState();
        expect(gameState.toJSON()).toEqual({ state: GameState.READY });

        gameState.startGame();
        expect(gameState.toJSON()).toEqual({ state: GameState.IN_PROGRESS });

        gameState.cancelGame();
        expect(gameState.toJSON()).toEqual({ state: GameState.CANCELLED });

        gameState = new GameState();
        gameState.startGame();
        gameState.endGame();
        expect(gameState.toJSON()).toEqual({ state: GameState.ENDED });
    });

});