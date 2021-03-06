var GameState = require('../../../lib/model/game-state')
  , _ = require('underscore');

describe('A GameState', function () {

    var globalGameState;

    function doConstructWith (initArg) {
        return function () {
            globalGameState = GameState(initArg);
        };
    }

    function expectNoStatusChange (initialState, action) {
        var gameState = GameState(initialState)
          , success;

        success = gameState[action].call();
        expect(success).toBe(false);
        expect(gameState.getState()).toBe(initialState);
    }

    it('should initialize with defaults', function () {
        expect(doConstructWith()).not.toThrow();
        expect(globalGameState instanceof GameState).toBe(true);
        expect(globalGameState.getState()).toBe(GameState.READY);
    });

    it('should initialize with a game state as the constructor argument', function () {
        var validState = GameState.CANCELLED;

        expect(doConstructWith(validState)).not.toThrow();
        expect(globalGameState instanceof GameState).toBe(true);
        expect(globalGameState.getState()).toBe(validState);
    });

    it('should initialize an independent instance with a GameState as the constructor argument', function () {
        var initialState = GameState.IN_PROGRESS
          , otherGameState = GameState(initialState);

        expect(doConstructWith(otherGameState)).not.toThrow();
        expect(globalGameState instanceof GameState).toBe(true);
        expect(globalGameState.getState()).toBe(initialState);

        otherGameState.endGame();
        expect(otherGameState.getState()).toBe(GameState.ENDED);
        expect(globalGameState.getState()).toBe(initialState);
    });

    it('should not initialize with a bad state', function () {
        expect(doConstructWith('badState')).toThrow();
    });

    it('should change state appropriately from game start to game end', function () {
        var gameState = GameState();

        gameState.startGame();
        expect(gameState.getState()).toBe(GameState.IN_PROGRESS);

        gameState.endGame();
        expect(gameState.getState()).toBe(GameState.ENDED);
    });

    it('should change state appropriately from game start to game cancelled', function () {
        var gameState = GameState();

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

    it('should generate an up-to-date JSON', function () {
        var gameState;
        
        gameState = GameState();
        expect(gameState.toJSON()).toEqual({ state: GameState.READY });

        gameState.startGame();
        expect(gameState.toJSON()).toEqual({ state: GameState.IN_PROGRESS });

        gameState.cancelGame();
        expect(gameState.toJSON()).toEqual({ state: GameState.CANCELLED });

        gameState = GameState();
        gameState.startGame();
        gameState.endGame();
        expect(gameState.toJSON()).toEqual({ state: GameState.ENDED });
    });

    it('should notify observers only if there is a state change', function () {
        var gameState
          , newState
          , spy = jasmine.createSpy('"notify state change"')
          , callback = function (state) {
                newState = state;
            };

        gameState = GameState();            
        gameState.observe(callback);
        gameState.startGame();
        expect(newState).toBe(GameState.IN_PROGRESS);
        gameState.endGame();
        expect(newState).toBe(GameState.ENDED);

        gameState = GameState(GameState.IN_PROGRESS);            
        gameState.observe(callback);
        gameState.cancelGame();
        expect(newState).toBe(GameState.CANCELLED);
        
        gameState = GameState(GameState.IN_PROGRESS);            
        gameState.observe(spy);
        gameState.startGame();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should have a comparison function', function () {
        var ready = GameState(GameState.READY)
          , inProgress = GameState(GameState.IN_PROGRESS)
          , ended = GameState(GameState.ENDED)
          , cancelled = GameState(GameState.CANCELLED);

        expect(ready.equals(GameState.READY)).toBe(true);
        expect(inProgress.equals(GameState.IN_PROGRESS)).toBe(true);
        expect(ended.equals(GameState.ENDED)).toBe(true);
        expect(cancelled.equals(GameState.CANCELLED)).toBe(true);

        expect(ready.equals(GameState(GameState.READY))).toBe(true);
        expect(inProgress.equals(GameState(GameState.IN_PROGRESS))).toBe(true);
        expect(ended.equals(GameState(GameState.ENDED))).toBe(true);
        expect(cancelled.equals(GameState(GameState.CANCELLED))).toBe(true);
    });

});