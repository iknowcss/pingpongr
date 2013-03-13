var PlayerSet,

    Validator = require('./validator'),
    _ = require('underscore'),

    defaults = {
        players: ['Player 1', 'Player 2']
    };

PlayerSet = function (initPlayers) {

    /* Private variables */
    var validator,
        players;

    /* Initializer */
    function init (initPlayers) {
        if (_.isUndefined(initPlayers)) {
            players = _.clone(defaults.players);
        } else if (initPlayers instanceof PlayerSet) {
            players = initPlayers.getPlayers();
        }
        else {
            verifyPlayers(initPlayers);
            players = _.clone(initPlayers);
        }
    }

    /* Getters */
    this.getPlayers = function () {
        return _.clone(players);
    };

    /* Verification */
    function verifyPlayers (players) {

    }

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
    init(initPlayers);

};

exports = module.exports = function (players) {
    return new PlayerSet(players);
};

exports.prototype = PlayerSet.prototype = {
    constructor: PlayerSet
};