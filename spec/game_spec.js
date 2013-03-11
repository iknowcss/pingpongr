describe('A GameState', function () {
    
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

});