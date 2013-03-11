var GameState = require('../lib/game-state'),
    _ = require('underscore');

describe('A GameState', function () {
    var game;

    beforeEach(function () {
        game = new GameState();
    });

    it('should change its status appropriately from game start to game end', function () {
        game.startGame();
        expect(game.getStatus()).toBe(GameState.IN_PROGRESS);

        game.endGame();
        expect(game.getStatus()).toBe(GameState.ENDED);
    });

    it('should change its status appropriately from game start to game cancelled', function () {
        game.startGame();
        expect(game.getStatus()).toBe(GameState.IN_PROGRESS);
        
        game.cancelGame();
        expect(game.getStatus()).toBe(GameState.CANCELLED);
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

    function expectNoStatusChange (initialStatus, action) {
        game = new GameState({ status: initialStatus });
        game[action].call();
        expect(game.getStatus()).toBe(initialStatus);
    }

});