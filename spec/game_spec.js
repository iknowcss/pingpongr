var Game = require('../lib/game')
    _ = require('underscore'),
    
    gameStatus = Game.gameStatus;

describe('A Game', function () {
    var game;

    beforeEach(function () {
        game = Game();
    });

    it('is constructed in the "ready" state by default', function () {
        expect(game.getStatus()).toBe(gameStatus.READY);
    });

    it('should change its status appropriately from game start to game end', function () {
        expect(game.startGame()).toBeTruthy();
        expect(game.getStatus()).toBe(gameStatus.IN_PROGRESS);
        expect(game.endGame()).toBeTruthy();
        expect(game.getStatus()).toBe(gameStatus.ENDED);
    });

    it('should change its status appropriately from game start to game cancelled', function () {
        expect(game.startGame()).toBeTruthy();
        expect(game.getStatus()).toBe(gameStatus.IN_PROGRESS);
        expect(game.cancelGame()).toBeTruthy();
        expect(game.getStatus()).toBe(gameStatus.CANCELLED);
    });

    it('should not start a game when "in-progress", "cancelled", or "ended"', function () {
        expectNoStatusChange(gameStatus.IN_PROGRESS, "startGame");
        expectNoStatusChange(gameStatus.CANCELLED, "startGame");
        expectNoStatusChange(gameStatus.ENDED, "startGame");
    });

    it('should not cancel or end a game when "ready", "cancelled", or "ended"', function () {
        expectNoStatusChange(gameStatus.READY, "cancelGame");
        expectNoStatusChange(gameStatus.CANCELLED, "cancelGame");
        expectNoStatusChange(gameStatus.ENDED, "cancelGame");

        expectNoStatusChange(gameStatus.READY, "endGame");
        expectNoStatusChange(gameStatus.CANCELLED, "endGame");
        expectNoStatusChange(gameStatus.ENDED, "endGame");
    });

    function expectNoStatusChange (initialStatus, action) {
        game = Game({ status: initialStatus });
        expect(game[action]()).toBeFalsy();
        expect(game.getStatus()).toBe(initialStatus);
    }

});