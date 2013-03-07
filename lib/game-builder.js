var Game = require('./game'),
    _ = require('underscore');

exports = module.exports = function () {

    var GameBuilder = {},
        gameOptions = {},
        status,
        players;

    GameBuilder.withDefaults = function () {
        gameOptions = _.clone(Game.defaults);
        return this;
    };

    GameBuilder.build = function () {
        return Game(gameOptions);
    };

    return GameBuilder;

};