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
        game = Game({ status: gameStatus.IN_PROGRESS });
        expect(game.startGame()).toBeFalsy();
        
        game = Game({ status: gameStatus.CANCELLED });
        expect(game.startGame()).toBeFalsy();
        
        game = Game({ status: gameStatus.ENDED });
        expect(game.startGame()).toBeFalsy();
    });

});