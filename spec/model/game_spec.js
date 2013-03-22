var Game = require('../../lib/model/game')
  , GameState = require('../../lib/model/game-state')
  , PlayerSet = require('../../lib/model/player-set')
  , PointCounter = require('../../lib/model/point-counter')
  , _ = require('underscore');

describe('A Game', function () {
    
    var globalGame;

    function doConstructWith (initArg) {
        return function () {
            globalGame = Game(initArg);
        };
    }

    it('should initialize with defaults', function () {
        var expectedState = GameState.READY
          , expectedPlayers = ['Player 1', 'Player 2']
          , expectedScore = [0, 0];

        expect(doConstructWith()).not.toThrow();
        expect(globalGame instanceof Game).toBe(true);
        expect(globalGame.gameState.getState()).toBe(expectedState);
        expect(globalGame.playerSet.getPlayers()).toEqual(expectedPlayers);
        expect(globalGame.pointCounter.getScore()).toEqual(expectedScore);
    });

    it('should initialize a valid game with provided components', function () {
        var defaults = {
                state: GameState.READY,
                score: [0, 0],
                players: ['Player 1', 'Player 2']
            }
          , providedState = { state: GameState.IN_PROGRESS }
          , providedScore = { score: [5, 0] }
          , providedPlayers = { players: ['Player X', 'Player Y'] }
          , provideAllThree = _.extend({}, providedState, providedScore, providedPlayers)
          , validation;

        expect(doConstructWith(providedState)).not.toThrow();
        expect(globalGame instanceof Game).toBe(true);
        expect(globalGame.validate().valid).toBe(true);
        expect(globalGame.gameState.getState()).toBe(providedState.state);

        expect(doConstructWith(providedScore)).not.toThrow();
        expect(globalGame instanceof Game).toBe(true);
        expect(globalGame.validate().valid).toBe(true);
        expect(globalGame.pointCounter.getScore()).toEqual(providedScore.score);

        expect(doConstructWith(providedPlayers)).not.toThrow();
        expect(globalGame instanceof Game).toBe(true);
        expect(globalGame.validate().valid).toBe(true);
        expect(globalGame.playerSet.getPlayers()).toEqual(providedPlayers.players);

        expect(doConstructWith(provideAllThree)).not.toThrow();
        expect(globalGame instanceof Game).toBe(true);
        expect(globalGame.validate().valid).toBe(true);
        expect(globalGame.gameState.getState()).toBe(providedState.state);
        expect(globalGame.pointCounter.getScore()).toEqual(providedScore.score);
        expect(globalGame.playerSet.getPlayers()).toEqual(providedPlayers.players);
    });

    it('should not validate with invalid provided components', function () {
        var invalidPlayerSet = { players: ['Lonely player', ''] }
          , invalidPointCounter = { score: [-1, 0] }
          , bothInvalid = _.extend({}, invalidPlayerSet, invalidPointCounter)
          , validation;

        validation = Game(invalidPlayerSet).validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        validation = Game(invalidPointCounter).validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        validation = Game(bothInvalid).validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(2);
    });

    it('should notify observers of change in state or points', function () {
        var game = Game()
          , newGameJSON
          , expectedPlayers = game.playerSet.getPlayers()
          , spy = jasmine.createSpy('"game updated callback"')
          , callback = function (param) {
                newGameJSON = param;
            };

        game.observe(spy);
        game.observe(callback);

        game.gameState.startGame();
        expect(spy.callCount).toBe(1);
        expect(newGameJSON).toEqual({
            state: GameState.IN_PROGRESS,
            score: [0, 0],
            players: expectedPlayers
        });

        game.pointCounter.pointLeft();
        expect(spy.callCount).toBe(2);
        expect(newGameJSON).toEqual({
            state: GameState.IN_PROGRESS,
            score: [1, 0],
            players: expectedPlayers
        });

    });

});