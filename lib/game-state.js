var GameState,
    Validator = require('./validator'),
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

GameState = function (options) {

    /* Private variables */
    var self = this,
        validator,
        playerSet,
        status;

    /* Initializer */
    function init (options) {
        var values = {};
        if (!_.isObject(options)) {
            options = {};
        }
        _.extend(values, defaults, options);

        status = values.status;
        playerSet = values.playerSet;
    }

    /* Getters */
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
        return validator.validate();
    };

    validator = new Validator({
        validatePlayerSet: function (validator) {
            if (!(playerSet instanceof PlayerSet)) {
                validator.error('playerSet is not a valid PlayerSet');
            } else {
                validator.append(playerSet.validate());
            }
        }
    });

    /* JSON */
    this.toJSON = function () {
        return {
            status: status,
            playerSet: playerSet.toJSON()
        };
    };

    // Initialize
    init.call(this, options);

};

exports = module.exports = GameState;
exports.status = _.clone(gameStatus);
exports.defaults = _.clone(defaults);