var PlayerSet,
    Validator = require('./validator'),
    _ = require('underscore'),
    slice = [].slice,
    validator;

PlayerSet = function () {

    /* Private variables */
    var validator,
        players;

    /* Initializer */
    function init () {
        var playerArray;
        if (_.isArray(arguments[0])) {
            players = arguments[0].slice(0, 2);
        } else {
            players = slice.call(arguments, 0, 2);
        }
    }

    /* Getters */
    this.getPlayers = function () {
        return _.clone(players);
    };

    /* Validation */
    this.validate = function () {
        return validator.validate();
    };

    validator = new Validator({
        validatePlayers: function (validator) {
            if (players.length !== 2) {
                validator.error('players array does not have 2 players');
                return;
            }
            if (!_.isString(players[0])) {
                validator.error('The first player is invalid');
            }
            if (!_.isString(players[1])) {
                validator.error('The second player is invalid');
            }
        }
    });

    /* JSON */
    this.toJSON = function () {
        return {
            players: this.getPlayers()
        };
    };

    // Initialize
    init.apply(this, arguments);

};

exports = module.exports = PlayerSet;