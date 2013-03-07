var Game = require('../lib/game'),
    _ = require('underscore');

describe('A Game', function () {
    var game;

    beforeEach(function () {
        game = Game();
    });

    it('is constructed with the proper defaults', function () {
        expect(game.getStatus()).toBe(Game.status.READY);
        expect(game.getPlayers()).toEqual(['Player 1', 'Player 2']);
    });

    it('should return an independent, cloned players array', function () {
        var players = game.getPlayers();
        players[0] = 'Player X';

        expect(game.getPlayers()).not.toEqual(players);
    });

    it('should change its status appropriately from game start to game end', function () {
        expect(game.startGame()).toBeTruthy();
        expect(game.getStatus()).toBe(Game.status.IN_PROGRESS);
        expect(game.endGame()).toBeTruthy();
        expect(game.getStatus()).toBe(Game.status.ENDED);
    });

    it('should change its status appropriately from game start to game cancelled', function () {
        expect(game.startGame()).toBeTruthy();
        expect(game.getStatus()).toBe(Game.status.IN_PROGRESS);
        expect(game.cancelGame()).toBeTruthy();
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

    it('should allow players to be set', function () {
        var newPlayers = ['Alice', 'Bob'];
        expect(game.setPlayers(newPlayers)).toBeTruthy();
        expect(game.getPlayers()).toEqual(newPlayers);
    });

    it('should not allow invalid players to be set', function () {
        var nonArray = {},
            invalidArray = ['Lone player'],
            invalidPlayers = [{}, {}];
        expect(game.setPlayers(nonArray)).toBeFalsy();
        expect(game.setPlayers(invalidArray)).toBeFalsy();
        expect(game.setPlayers(invalidPlayers)).toBeFalsy();
        expect(game.getPlayers()).toEqual(Game.defaults.players);
    });

    it('should not allow players to be set when game is not in "ready" state', function () {
        var newPlayers = ['Alice', 'Bob'];
        game.startGame();
        expect(game.setPlayers(newPlayers)).toBeFalsy();
        expect(game.getPlayers()).toEqual(Game.defaults.players);
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
        expect(game[action]()).toBeFalsy();
        expect(game.getStatus()).toBe(initialStatus);
    }

});