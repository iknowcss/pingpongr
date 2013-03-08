var Game = require('../lib/game'),
    PlayerSet = require('../lib/player-set'),
    _ = require('underscore');

describe('A Game', function () {
    var game;

    beforeEach(function () {
        game = new Game();
    });

    it('should change its status appropriately from game start to game end', function () {
        game.startGame();
        expect(game.getStatus()).toBe(Game.status.IN_PROGRESS);

        game.endGame();
        expect(game.getStatus()).toBe(Game.status.ENDED);
    });

    it('should change its status appropriately from game start to game cancelled', function () {
        game.startGame();
        expect(game.getStatus()).toBe(Game.status.IN_PROGRESS);
        
        game.cancelGame();
        expect(game.getStatus()).toBe(Game.status.CANCELLED);
    });

    it('should not start a game when "in-progress", "cancelled", or "ended"', function () {
        expectNoStatusChange(Game.status.IN_PROGRESS, "startGame");
        expectNoStatusChange(Game.status.CANCELLED, "startGame");
        expectNoStatusChange(Game.status.ENDED, "startGame");
    });

    it('should not cancel or end a game when "ready", "cancelled", or "ended"', function () {
        expectNoStatusChange(Game.status.READY, "cancelGame");
        expectNoStatusChange(Game.status.CANCELLED, "cancelGame");
        expectNoStatusChange(Game.status.ENDED, "cancelGame");

        expectNoStatusChange(Game.status.READY, "endGame");
        expectNoStatusChange(Game.status.CANCELLED, "endGame");
        expectNoStatusChange(Game.status.ENDED, "endGame");
    });

    it('should not validate when an invalid playerSet is set', function () {
        var nonPlayerSet = {},
            invalidPlayerSet = new PlayerSet('Lone player'),
            validPlayerSet = new PlayerSet('Player X', 'Player Y');

        game = new Game({ playerSet: nonPlayerSet })
        expect(game.validate().isValid()).toBe(false);

        game = new Game({ playerSet: invalidPlayerSet })
        expect(game.validate().isValid()).toBe(false);
        
        game = new Game({ playerSet: validPlayerSet })
        expect(game.validate().isValid()).toBe(true);
    });

    it('should generate an up-to-date JSON', function () {
        var expectedJson = {
                status: Game.status.IN_PROGRESS,
                playerSet: {
                    players: ['Player 1', 'Player 2']
                }
            };
        game.startGame();
        expect(game.toJSON()).toEqual(expectedJson);
    });

    function expectNoStatusChange (initialStatus, action) {
        game = new Game({ status: initialStatus });
        game[action].call();
        expect(game.getStatus()).toBe(initialStatus);
    }

});