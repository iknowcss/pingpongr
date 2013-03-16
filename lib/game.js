var Game,
    GameState = require('./game-state'),
    PlayerSet = require('./player-set'),
    PointCounter = require('./point-counter'),
    Validator = require('./validator'),
    _ = require('underscore');

Game = function (options) {

    var validator;

    function init (options) {
        if (!_.isObject(options)) {
            options = {};
        }

        this.gameState = GameState(options.state);
        this.playerSet = PlayerSet(options.players);
        this.pointCounter = PointCounter(options.score);
    }

    /* Validation */
    this.validate = function () {
        return validator.validate();
    };

    validator = new Validator({
        validatePlayerSet: function () {
            validator.append(this.playerSet.validate());
        },
        validatePointCounter: function () {
            validator.append(this.pointCounter.validate());
        }
    });

    /* JSON */
    this.toJSON = function () {
        return {
            state: this.gameState.getState(),
            score: this.pointCounter.getScore(),
            players: this.playerSet.getPlayers()
        };
    };

    // Initialize
    init.call(this, options);

};

exports = module.exports = function (options) {
    return new Game(options);
};

exports.prototype = Game.prototype = {
    constructor: Game
};