var PlayerSet = require('../lib/player-set'),
    Validator = require('../lib/validator'),
    _ = require('underscore');

describe('A PlayerSet', function () {

    var playerSet;

    it('should be constructed with two player arguments or an array of players', function () {
        playerSet = new PlayerSet('Player A', 'Player B');
        expect(playerSet.getPlayers()).toEqual(['Player A', 'Player B']);

        playerSet = new PlayerSet(['Player X', 'Player Y']);
        expect(playerSet.getPlayers()).toEqual(['Player X', 'Player Y']);
    });

    it('should return an independent, cloned copy of the players array', function () {
        var players;

        playerSet = new PlayerSet('Player A', 'Player B');        
        players = playerSet.getPlayers();
        players[0] = 'foo';

        expect(playerSet.getPlayers()).not.toEqual(players);
    });

    it('should not validate when there are not two players', function () {
        var validation;

        playerSet = new PlayerSet();
        validation = playerSet.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        playerSet = new PlayerSet('Lonely Player');
        validation = playerSet.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        playerSet = new PlayerSet('Player P', 'Player Q');
        validation = playerSet.validate();
        expect(validation.valid).toBe(true);
        expect(validation.errors.length).toBe(0);
    });

    it('should not validate either of the players is of the wrong type', function () {
        var validation;

        playerSet = new PlayerSet('Player X', 3);
        validation = playerSet.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        playerSet = new PlayerSet(4.2, 'Player Y');
        validation = playerSet.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        playerSet = new PlayerSet({}, []);
        validation = playerSet.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(2);
    });

    it('should generate an up-to-date JSON', function () {
        var playerSet = new PlayerSet('Player G', 'Player H')
            expectedJson = {
                players: ['Player G', 'Player H']
            };
        expect(playerSet.toJSON()).toEqual(expectedJson);
    });

});