var _ = require('underscore'),
    gameStatus = {
        IN_PROGRESS: 'in-progress',
        CANCELLED: 'cancelled',
        READY: 'ready',
        ENDED: 'ended' 
    },
    defaults = {
        status: gameStatus.READY,
        players: ['Player 1', 'Player 2']
    };

exports = module.exports = function (options) {

    // Private variables
    var Game = {},
        validators,
        players,
        status;

    // Constructor
    function init (options) {
        var values = {};
        if (!_.isObject(options)) {
            options = {};
        }
        _.extend(values, defaults, options);

        status = values.status;
        players = _.clone(values.players);
    }

    /* Getters and setters */

    Game.getStatus = function () {
        return status;
    };

    Game.getPlayers = function () {
        return _.clone(players);
    };

    /* Commands */

    Game.startGame = function () {
        if (status === gameStatus.READY) {
            status = gameStatus.IN_PROGRESS;
            return true;
        } else {
            return false;
        }
    };

    Game.endGame = function () {
        if (status === gameStatus.IN_PROGRESS) {
            status = gameStatus.ENDED;
            return true;
        } else {
            return false;
        }
    };

    Game.cancelGame = function () {
        if (status === gameStatus.IN_PROGRESS) {
            status = gameStatus.CANCELLED;
            return true;
        } else {
            return false;
        }
    };

    /* Validation */

    validators = {
        validatePlayers: function () {
            var validation = {
                    errors: [],
                    valid: true
                };

            if (!_.isArray(players)) {
                validation.valid = false;
                validation.errors.push('players was not an Array');
                return validation;
            }
            if (players.length !== 2) {
                validation.valid = false;
                validation.errors.push('players array did not have 2 elements');
                return validation;
            }
            if (!_.isString(players[0]) || players[0].length === 0) {
                validation.valid = false;
                validation.errors.push('first player was not a valid string');
            }
            if (!_.isString(players[1]) || players[1].length === 0) {
                validation.valid = false;
                validation.errors.push('second player was not a valid string');
            }

            return validation;
        }
    };

    Game.validate = function () {
        var validation = {
                errors: [],
                valid: true
            };

        _.each(validators, function(validator, name) {
            var subValidation = validator();
            if (!subValidation.valid) {
                validation.valid = false;
                subValidation.errors.map(function () {
                    validation.errors.push(this);
                });
            }
        });

        return validation;
    };

    /* Utility functions */

    Game.toJSON = function () {
        return {
            status: Game.getStatus(),
            players: Game.getPlayers()
        };
    };

    // Initialize
    init(options);
    return Game;

};

exports.status = _.clone(gameStatus);
exports.defaults = _.clone(defaults);