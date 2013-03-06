var gameStatus = {
        IN_PROGRESS: 'in-progress',
        CANCELLED: 'cancelled',
        READY: 'ready',
        ENDED: 'ended' 
    },
    gameDefaults = {
        status: gameStatus.READY
    },
    _ = require('underscore');

exports = module.exports = function (options) {

    var Game = {},
        points,
        status;

    function init (options) {
        if (!_.isObject(options)) {
            options = {};
        }

        points = [];
        status = options.status || gameStatus.READY;
    }

    Game.getStatus = function () {
        return status;
    };

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

    init(options);
    return Game;

};

exports.gameStatus = _.clone(gameStatus);