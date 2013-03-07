var Game = require('../lib/game'),
    _ = require('underscore');

describe('A Game', function () {
    var game;

    beforeEach(function () {
        game = Game();
    });

    it('should return an independent, cloned players array', function () {
        var players = game.getPlayers();
        players[0] = 'Player X';

        expect(game.getPlayers()).not.toEqual(players);
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

    it('should not validate when invalid players are set', function () {
        var nonArray = {},
            invalidArray = ['Lone player'],
            invalidPlayerType = [{}, {}];

        game = Game({ players: nonArray });
        expect(game.validate().valid).toBeFalsy();

        game = Game({ players: invalidArray });
        expect(game.validate().valid).toBeFalsy();

        game = Game({ players: invalidPlayerType });
        expect(game.validate().valid).toBeFalsy();
    });

    it('should generate an up-to-date JSON', function () {
        var expectedJson = {
            status: Game.status.IN_PROGRESS,
            players: ['Player 1', 'Player 2']
        };
        game.startGame();
        expect(game.toJSON()).toEqual(expectedJson);
    });

    function expectNoStatusChange (initialStatus, action) {
        game = Game({ status: initialStatus });
        game[action].call();
        expect(game.getStatus()).toBe(initialStatus);
    }

});