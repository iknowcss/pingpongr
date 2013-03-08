var Game,
    Validation = require('./validation'),
    PlayerSet = require('./player-set'),
    _ = require('underscore'),
    gameStatus = {
        IN_PROGRESS: 'in-progress',
        CANCELLED: 'cancelled',
        READY: 'ready',
        ENDED: 'ended' 
    },
    defaults = {
        status: gameStatus.READY,
        playerSet: new PlayerSet('Player 1', 'Player 2')
    };

Game = function (options) {

    // Private variables
    var self = this,
        validators,
        playerSet,
        status;

    // Constructor
    function init (options) {
        var values = {};
        if (!_.isObject(options)) {
            options = {};
        }
        _.extend(values, defaults, options);

        status = values.status;
        playerSet = values.playerSet;
    }

    /* Getters and setters */

    this.getStatus = function () {
        return status;
    };

    this.getPlayerSet = function () {
        return playerSet;
    };

    this.getPlayers = function () {
        return playerSet.getPlayers();
    }

    /* Commands */

    this.startGame = function () {
        if (status === gameStatus.READY) {
            status = gameStatus.IN_PROGRESS;
            return true;
        } else {
            return false;
        }
    };

    this.endGame = function () {
        if (status === gameStatus.IN_PROGRESS) {
            status = gameStatus.ENDED;
            return true;
        } else {
            return false;
        }
    };

    this.cancelGame = function () {
        if (status === gameStatus.IN_PROGRESS) {
            status = gameStatus.CANCELLED;
            return true;
        } else {
            return false;
        }
    };

    /* Validation */

    this.validate = function () {
        return Validation().validateWith(validators);
    };

    validators = {
        validatePlayers: function () {
            var validation = Validation();

            if (!(playerSet instanceof PlayerSet)) {
                validation.addError('playerSet is not a valid PlayerSet');
                return validation;
            }
            validation.addError(playerSet.validate().getErrors());

            return validation;
        }
    };

    /* Utility functions */

    this.toJSON = function () {
        return {
            status: status,
            playerSet: playerSet.toJSON()
        };
    };

    // Initialize
    init(options);

};

exports = module.exports = Game;
exports.status = _.clone(gameStatus);
exports.defaults = _.clone(defaults);