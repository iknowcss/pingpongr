var GameState = require('../lib/game-state'),
    PlayerSet = require('../lib/player-set'),
    _ = require('underscore');

describe('A GameState', function () {
    var game;

    beforeEach(function () {
        game = new GameState();
    });

    it('should change its status appropriately from game start to game end', function () {
        game.startGame();
        expect(game.getStatus()).toBe(GameState.status.IN_PROGRESS);

        game.endGame();
        expect(game.getStatus()).toBe(GameState.status.ENDED);
    });

    it('should change its status appropriately from game start to game cancelled', function () {
        game.startGame();
        expect(game.getStatus()).toBe(GameState.status.IN_PROGRESS);
        
        game.cancelGame();
        expect(game.getStatus()).toBe(GameState.status.CANCELLED);
    });

    it('should not start a game when "in-progress", "cancelled", or "ended"', function () {
        expectNoStatusChange(GameState.status.IN_PROGRESS, "startGame");
        expectNoStatusChange(GameState.status.CANCELLED, "startGame");
        expectNoStatusChange(GameState.status.ENDED, "startGame");
    });

    it('should not cancel or end a game when "ready", "cancelled", or "ended"', function () {
        expectNoStatusChange(GameState.status.READY, "cancelGame");
        expectNoStatusChange(GameState.status.CANCELLED, "cancelGame");
        expectNoStatusChange(GameState.status.ENDED, "cancelGame");

        expectNoStatusChange(GameState.status.READY, "endGame");
        expectNoStatusChange(GameState.status.CANCELLED, "endGame");
        expectNoStatusChange(GameState.status.ENDED, "endGame");
    });

    it('should not validate when an invalid playerSet is set', function () {
        var validation,
            nonPlayerSet = {},
            incompletePlayerSet = new PlayerSet('Lone player'),
            invalidPlayerSet = new PlayerSet(4.3, 5),
            validPlayerSet = new PlayerSet('Player X', 'Player Y');

        game = new GameState({ playerSet: nonPlayerSet });
        validation = game.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        game = new GameState({ playerSet: incompletePlayerSet });
        validation = game.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        game = new GameState({ playerSet: invalidPlayerSet });
        validation = game.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(2);
        
        game = new GameState({ playerSet: validPlayerSet });
        validation = game.validate();
        expect(validation.valid).toBe(true);
        expect(validation.errors.length).toBe(0);

    });

    it('should generate an up-to-date JSON', function () {
        var expectedJson = {
                status: GameState.status.IN_PROGRESS,
                playerSet: {
                    players: ['Player 1', 'Player 2']
                }
            };
        game.startGame();
        expect(game.toJSON()).toEqual(expectedJson);
    });

    function expectNoStatusChange (initialStatus, action) {
        game = new GameState({ status: initialStatus });
        game[action].call();
        expect(game.getStatus()).toBe(initialStatus);
    }

});