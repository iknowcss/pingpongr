var PlayerSet = require('../lib/player-set'),
    Validator = require('../lib/validator'),
    _ = require('underscore');

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
        var players = ['Player X', 'Player Y'],
            otherPlayerSet = PlayerSet(players);

        expect(doConstructWith(otherPlayerSet)).not.toThrow();
        expect(globalPlayerSet instanceof PlayerSet).toBe(true);
        expect(globalPlayerSet.getPlayers()).toEqual(players);

        // TODO: test independence when possible
    });

    // it('should return an independent, cloned copy of the players array', function () {
    //     var players;

    //     playerSet = new PlayerSet(['Player A', 'Player B']);        
    //     players = playerSet.getPlayers();
    //     players[0] = 'foo';

    //     expect(playerSet.getPlayers()).not.toEqual(players);
    // });

    // it('should not validate when there are not two players', function () {
    //     var validation;

    //     playerSet = new PlayerSet([]);
    //     validation = playerSet.validate();
    //     expect(validation.valid).toBe(false);
    //     expect(validation.errors.length).toBe(1);

    //     playerSet = new PlayerSet(['Lonely Player']);
    //     validation = playerSet.validate();
    //     expect(validation.valid).toBe(false);
    //     expect(validation.errors.length).toBe(1);

    //     playerSet = new PlayerSet(['Player P', 'Player Q']);
    //     validation = playerSet.validate();
    //     expect(validation.valid).toBe(true);
    //     expect(validation.errors.length).toBe(0);
    // });

    // it('should not validate either of the players is of the wrong type', function () {
    //     var validation;

    //     playerSet = new PlayerSet(['Player X', 3]);
    //     validation = playerSet.validate();
    //     expect(validation.valid).toBe(false);
    //     expect(validation.errors.length).toBe(1);

    //     playerSet = new PlayerSet([4.2, 'Player Y']);
    //     validation = playerSet.validate();
    //     expect(validation.valid).toBe(false);
    //     expect(validation.errors.length).toBe(1);

    //     playerSet = new PlayerSet([{}, []]);
    //     validation = playerSet.validate();
    //     expect(validation.valid).toBe(false);
    //     expect(validation.errors.length).toBe(2);
    // });

    // it('should generate an up-to-date JSON', function () {
    //     var playerSet = new PlayerSet(['Player G', 'Player H'])
    //         expectedJson = {
    //             players: ['Player G', 'Player H']
    //         };
    //     expect(playerSet.toJSON()).toEqual(expectedJson);
    // });

});