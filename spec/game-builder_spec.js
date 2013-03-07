var GameBuilder = require('../lib/game-builder.js'),
	Game = require('../lib/game.js'),
	_ = require('underscore');

describe('A GameBuilder', function () {

	var gameBuilder;

	beforeEach(function () {
		gameBuilder = GameBuilder();
	});

	it('should build a game with defaults', function () {
		var game = gameBuilder.withDefaults().build();
		expect(game.getStatus()).toBe(Game.defaults.status);
		expect(game.getPlayers()).toEqual(Game.defaults.players);
	});

});