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
            var errors = [];

            if (!_.isArray(players)) {
                errors.push('players is not an Array');
            } else if  (players.length !== 2) {
                errors.push('players array does not have 2 elements');
            } else {
                _.each(players, function (player, i) {
                    if (!_.isString(player)) {
                        errors.push('player ' + i + ' is not a player object');
                    }
                });
            }

            return {
                valid: _.isEmpty(errors),
                errors: errors
            };
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