var Game,
    GameState = require('./game-state'),
    PlayerSet = require('./player-set'),
    PointCounter = require('./point-counter'),
    Validator = require('./validator'),
    _ = require('underscore');

Game = function (options) {

    var gameState,
        playerSet,
        pointCounter,
        validator;

    function init (options) {
        if (!_.isObject(options)) {
            options = {};
        }

        gameState = GameState(options.state);
        playerSet = PlayerSet(options.players);
        pointCounter = PointCounter(options.score);
    }

    /* Validation */
    this.validate = function () {
        return validator.validate();
    };

    validator = new Validator({
        validatePlayerSet: function () {
            validator.append(playerSet.validate());
        },
        validatePointCounter: function () {
            validator.append(pointCounter.validate());
        }
    });

    /* JSON */
    this.toJSON = function () {
        return {
            state: gameState.getState(),
            score: pointCounter.getScore(),
            players: playerSet.getPlayers()
        }
    };

    // Initialize
    init(options);

};

exports = module.exports = function (options) {
    return new Game(options);
};

exports.prototype = Game.prototype = {
    constructor: Game
};