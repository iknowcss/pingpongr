var game = require('../lib/game')
    _ = require('underscore'),
    
    gameStatus = game.gameStatus;

describe('A Game', function () {
    var gameInstance;

    beforeEach(function () {
        gameInstance = game();
    });

    it('is constructed in the "ready" state by default', function () {
        expect(gameInstance.status()).toBe(gameStatus.READY);
    });

    it('should change its status appropriately from game start to game end', function () {
        expect(gameInstance.startGame()).toBeTruthy();
        expect(gameInstance.status()).toBe(gameStatus.IN_PROGRESS);
        expect(gameInstance.endGame()).toBeTruthy();
        expect(gameInstance.status()).toBe(gameStatus.ENDED);
    });

    it('should change its status appropriately from game start to game cancelled', function () {
        expect(gameInstance.startGame()).toBeTruthy();
        expect(gameInstance.status()).toBe(gameStatus.IN_PROGRESS);
        expect(gameInstance.cancelGame()).toBeTruthy();
        expect(gameInstance.status()).toBe(gameStatus.CANCELLED);
    });

    it('should not start a game when "in-progress", "cancelled", or "ended"', function () {
        gameInstance = game({ status: gameStatus.IN_PROGRESS });
        expect(gameInstance.startGame()).toBeFalsy();
        
        gameInstance = game({ status: gameStatus.CANCELLED });
        expect(gameInstance.startGame()).toBeFalsy();
        
        gameInstance = game({ status: gameStatus.ENDED });
        expect(gameInstance.startGame()).toBeFalsy();
    });

});