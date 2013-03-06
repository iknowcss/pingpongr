var game = require('../lib/game'),
    
    gameStatus = game.gameStatus;

describe('A Game', function () {
    var gameInstance;

    beforeEach(function () {
        gameInstance = game();
    });

    it('is constructed in the "ready" state', function () {
        expect(gameInstance.status()).toBe('ready');
    });

    it('should change its status to "in-progress" when started', function () {
        gameInstance.startGame();
        expect(gameInstance.status()).toBe('in-progress');
    });

});