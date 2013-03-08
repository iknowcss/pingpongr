var PlayerSet,
    Validation = require('./validation'),
    _ = require('underscore'),
    slice = [].slice;

PlayerSet = function () {

    // Private variables
    var self = this,
        validators,
        players;

    // Constructor
    function init () {
        var playerArray;
        if (_.isArray(arguments[0])) {
            players = arguments[0].slice(0, 2);
        } else {
            players = slice.call(arguments, 0, 2);
        }
    }

    this.getPlayers = function () {
        return _.clone(players);
    };

    this.validate = function () {
        return Validation().validateWith(validators);
    };

    validators = {
        validatePlayers: function () {
            var validation = Validation();

            if (players.length !== 2) {
                validation.addError('players array does not have 2 players');
                return validation;
            }

            if (!_.isString(players[0])) {
                validation.addError('The first player is invalid');
            }
            if (!_.isString(players[1])) {
                validation.addError('The second player is invalid');
            }

            return validation;
        }
    };

    // Utility
    this.toJSON = function () {
        return {
            players: self.getPlayers()
        }
    };

    // Initialize
    init.apply(this, arguments);

};

exports = module.exports = PlayerSet;