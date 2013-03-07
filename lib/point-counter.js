var _ = require('underscore'),
    defaults = {
        points: [0, 0]
    };

exports = module.exports = function (options) {

    var PointCounter = {},
        validators,
        points,
        players;

    function init (options) {
        var values = {},
            playersValidation;
        if (!_.isObject(options)) {
            options = {};
        }
        _.extend(values, defaults, options);

        points = _.clone(values.points);
        players = _.clone(values.players);

        playersValidation = validators.validatePlayers();
        if (!playersValidation.valid) {
            throw 'players was invalid:\n' + 
                    playersValidation.errors;
        }
    }

    PointCounter.getPoints = function () {
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
    return PointCounter;

};