var GameState,
    _ = require('underscore'),
    possibleStates = {
        IN_PROGRESS: 'in-progress',
        CANCELLED: 'cancelled',
        READY: 'ready',
        ENDED: 'ended' 
    },
    defaults = {
        status: possibleStates.READY
    };

GameState = function (options) {

    /* Private variables */
    var self = this,
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
        if (status === GameState.READY) {
            status = GameState.IN_PROGRESS;
            return true;
        } else {
            return false;
        }
    };

    this.endGame = function () {
        if (status === GameState.IN_PROGRESS) {
            status = GameState.ENDED;
            return true;
        } else {
            return false;
        }
    };

    this.cancelGame = function () {
        if (status === GameState.IN_PROGRESS) {
            status = GameState.CANCELLED;
            return true;
        } else {
            return false;
        }
    };

    /* JSON */
    this.toJSON = function () {
        return {
            status: status
        };
    };

    // Initialize
    init.call(this, options);

};

_.extend(GameState, possibleStates);

exports = module.exports = GameState;