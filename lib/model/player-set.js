var PlayerSet

  , Validator = require('../validation/validator')
  , _ = require('underscore')

  , MAX_PLAYER_NAME_LENGTH = 25

  , defaults = {
        players: ['Player 1', 'Player 2']
    };

PlayerSet = function (initPlayers) {

    /* Private variables */
    var validator
      , players;

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
        if (!_.isArray(players)) {
            throw new Error('players was not an array');
        }
        if (players.length !== 2) {
            throw new Error('players array did not have length 2');
        }
        _.each(players, function (player) {
            if (typeof player !== 'string') {
                throw new Error('players array did not contain only strings');
            }
        });
    }

    /* Validation */
    this.validate = function () {
        return validator.validate();
    };

    validator = new Validator({
        validatePlayerLengths: function (validator) {
            _.each(players, function (player) {
                if (player.length === 0) {
                    validator.error('player name was empty');
                } else if (player.length > MAX_PLAYER_NAME_LENGTH) {
                    validator.error('player name was longer than ' + 
                        MAX_PLAYER_NAME_LENGTH + 'characters');
                }
            });
        }
    });

    /* JSON */
    this.toJSON = function () {
        return {
            players: this.getPlayers()
        };
    };

    // Initialize
    init.call(this, initPlayers);

};

exports = module.exports = function (players) {
    return new PlayerSet(players);
};

exports.prototype = PlayerSet.prototype = {
    constructor: PlayerSet
};