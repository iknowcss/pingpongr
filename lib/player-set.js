var PlayerSet,
    Validator = require('./validator'),
    _ = require('underscore'),
    validator,
    defaults = {
        players: ['Player 1', 'Player 2']
    };

PlayerSet = function (options) {

    /* Private variables */
    var validator,
        players;

    /* Initializer */
    function init (options) {
        var playerArray;
        if (_.isUndefined(options)) {
            players = _.clone(defaults.players);
        } else if (_.isArray(options)) {
            players = options.slice(0, 2);
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
    init(options);

};

exports = module.exports = PlayerSet;