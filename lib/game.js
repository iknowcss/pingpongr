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

        gameState = (options.gameState instanceof GameState) ?
            options.gameState : new GameState();
        playerSet = (options.playerSet instanceof PlayerSet) ?
            options.playerSet : new PlayerSet();
        pointCounter = (options.pointCounter instanceof PointCounter) ?
            options.pointCounter : new PointCounter();
    }

    /* Validation */
    this.validate = function () {
        return validator.validate();
    };

    validator = new Validator({
        validateGameState: function (validator) {
            validator.append(gameState.validate());
        },
        validatePlayerSet: function () {
            validator.append(playerSet.validate());
        },
        validatePointCounter: function () {
            validator.append(pointCounter.validate());
        }
    });

    // Initialize
    init(options);

};

exports = module.exports = Game;