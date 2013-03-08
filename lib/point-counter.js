var PointCounter,
    PlayerSet = require('./player-set'),
    _ = require('underscore'),
    defaults = {
        points: [0, 0]
    };

PointCounter = function (options) {

    var validators,
        points,
        players;

    function init (options) {
        var values = {};
        if (!_.isObject(options)) {
            options = {};
        }
        _.extend(values, defaults, options);

        points = _.clone(values.points);
        players = values.players;

        if (!(players instanceof PlayerSet)) {
            throw new Error('players was not set to a PlayerSet');
        }
        if (!players.validate().isValid()) {
            throw new Error('players was not a valid PlayerSet');
        }
    }

    this.getPoints = function () {
        return _.clone(points);
    };

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

    init(options);

};

exports = module.exports = PointCounter;