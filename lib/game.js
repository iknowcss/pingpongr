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

    var game = {},
        points,
        status;

    function init (options) {
        if (!_.isObject(options)) {
            options = {};
        }

        points = [];
        status = options.status || gameStatus.READY;
    }

    game.status = function () {
        return status;
    };

    game.startGame = function () {
        if (status === gameStatus.READY) {
            status = gameStatus.IN_PROGRESS;
            return true;
        } else {
            return false;
        }
    };

    game.endGame = function () {
        if (status === gameStatus.IN_PROGRESS) {
            status = gameStatus.ENDED;
            return true;
        } else {
            return false;
        }
    };

    game.cancelGame = function () {
        if (status === gameStatus.IN_PROGRESS) {
            status = gameStatus.CANCELLED;
            return true;
        } else {
            return false;
        }
    };

    init(options);
    return game;

};

exports.gameStatus = _.clone(gameStatus);