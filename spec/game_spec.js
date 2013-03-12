var Game = require('../lib/game');

describe('A GameState', function () {
    
    var game;

    beforeEach(function () {
        game = new Game();
    });

    it('should initialize with valid defaults', function () {
        var validation = game.validate();
        expect(validation.valid).toBe(true);
    });

});