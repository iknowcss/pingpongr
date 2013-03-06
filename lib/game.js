var _ = require('underscore'),
    gameStatus = {
        READY: 'ready',
        IN_PROGRESS: 'in-progress',
        CANCELLED: 'cancelled',
        };

exports = module.exports = function () {

    var game = {},

        points = [],
        status = 'ready';

    game.status = function () {
        return status;
    }

    game.startGame = function () {
        status = 'in-progress';
    }

    return game;

};

exports.gameStatus = gameStatus;