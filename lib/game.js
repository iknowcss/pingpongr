var gameStatus = {
        IN_PROGRESS: 'in-progress',
        CANCELLED: 'cancelled',
        READY: 'ready',
        ENDED: 'ended' 
    },
    defaults = {
        status: gameStatus.READY,
        players: ['Player 1', 'Player 2']
    },
    _ = require('underscore');

exports = module.exports = function (options) {

    var Game = {},
        players,
        status;

    function init (options) {
        var values = {};
        if (!_.isObject(options)) {
            options = {};
        }
        _.extend(values, defaults, options);

        status = _.clone(values.status);
        Game.setPlayers(values.players);
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

    Game.setPlayers = function (newPlayers) {
        if (validatePlayers(newPlayers)) {
            players = _.clone(newPlayers);
            return true;
        } else {
            return false;
        }
    };

    Game.getPlayers = function () {
        return _.clone(players);
    };

    Game.toJSON = function () {
        return {
            status: Game.getStatus(),
            players: Game.getPlayers()
        };
    }

    function validatePlayers (newPlayers) {
        return status === gameStatus.READY &&
                _.isArray(newPlayers) &&
                newPlayers.length == 2 &&
                _.isString(newPlayers[0]) &&
                _.isString(newPlayers[1]);
    }

    init(options);
    return Game;

};

exports.status = _.clone(gameStatus);
exports.defaults = _.clone(defaults);