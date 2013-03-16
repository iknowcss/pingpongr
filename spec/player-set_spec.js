var PlayerSet = require('../lib/player-set')
  , Validator = require('../lib/validator')
  , _ = require('underscore');

describe('A PlayerSet', function () {

    var globalPlayerSet;

    function doConstructWith (initArg) {
        return function () {
            globalPlayerSet = PlayerSet(initArg);
        };
    }

    it('should initialize with valid defaults', function () {
        expect(doConstructWith()).not.toThrow();
        expect(globalPlayerSet instanceof PlayerSet).toBe(true);
        expect(globalPlayerSet.getPlayers()).toEqual(['Player 1', 'Player 2']);
    });

    it('should initialize with a players array constructor argument', function () {
        var players = ['Player A', 'Player B'];

        expect(doConstructWith(players)).not.toThrow();
        expect(globalPlayerSet instanceof PlayerSet).toBe(true);
        expect(globalPlayerSet.getPlayers()).toEqual(players);
    });

    it('should initialize an independent instance with a PlayerSet constructor argument', function () {
        var players = ['Player X', 'Player Y']
          , otherPlayerSet = PlayerSet(players);

        expect(doConstructWith(otherPlayerSet)).not.toThrow();
        expect(globalPlayerSet instanceof PlayerSet).toBe(true);
        expect(globalPlayerSet.getPlayers()).toEqual(players);

        // TODO: test independence when possible
    });

    it('should not initialize with a bad constructor argument', function () {
        var wrongType = {}
          , tooFewPlayers = ['Lonely player']
          , invalidButNotBad = ['', 'Other player'];

        expect(doConstructWith(wrongType)).toThrow();
        expect(doConstructWith(tooFewPlayers)).toThrow();
        expect(doConstructWith(invalidButNotBad)).not.toThrow();
    });

    it('should not initialize if either of the players is of the wrong type', function () {
        var wrongLeftPlayer = [new Object('One player'), 'Two player']
          , wrongRightPlayer = ['Red player', new Object('Blue player')];

        expect(doConstructWith(wrongLeftPlayer)).toThrow();
        expect(doConstructWith(wrongRightPlayer)).toThrow();
    });

    it('should return an independent, cloned copy of the players array', function () {
        var expectedPlayers = ['Player A', 'Player B']
          , playerSet = PlayerSet(expectedPlayers)
          , players = playerSet.getPlayers();

        players[0] = 'foo';
        expect(playerSet.getPlayers()).toEqual(expectedPlayers);
    });

    it('should not validate if the player name lengths are invalid', function () {
        var tooShort = ''
          , tooLong = 'Jose de Espinosa Dominguez'  // Greater than 25 characters
          , justRight = 'Germano del Los Hernandez' // Exactly 25 characters
          , longLeftPlayer = PlayerSet([ tooLong, justRight ])
          , longRightPlayer = PlayerSet([ justRight, tooLong ])
          , shortLeftPlayer = PlayerSet([ tooShort, justRight ])
          , shortRightPlayer = PlayerSet([ justRight, tooShort ])
          , bothWrong = PlayerSet([ tooLong, tooShort ])
          , validation;

        validation = longLeftPlayer.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        validation = longRightPlayer.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        validation = shortLeftPlayer.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        validation = shortRightPlayer.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        validation = bothWrong.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(2);
    });

    it('should generate an up-to-date JSON', function () {
        var players = ['Player G', 'Player H']
          , playerSet = PlayerSet(players)
          , expectedJson = {
                players: players
            };

        expect(playerSet.toJSON()).toEqual(expectedJson);
    });

});