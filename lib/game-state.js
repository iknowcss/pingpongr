var GameState,
    Validator = require('./validator'),
    _ = require('underscore'),
    possibleStates = {
        IN_PROGRESS: 'in-progress',
        CANCELLED: 'cancelled',
        READY: 'ready',
        ENDED: 'ended' 
    },
    defaults = {
        state: possibleStates.READY
    };

GameState = function (options) {

    /* Private variables */
    var playerSet,
        state,
        validator;

    /* Initializer */
    function init (options) {
        var values;
        if (_.isUndefined(options)) {
            state = defaults.state;
        } else if (typeof options === 'string') {
            state = options
        } else if (_.isObject(options)) {
            values = _.extend({}, defaults, options);
            state = values.state;
        }
    }

    /* Getters */
    this.getState = function () {
        return state;
    };

    /* Commands */
    this.startGame = function () {
        if (state === GameState.READY) {
            state = GameState.IN_PROGRESS;
            return true;
        } else {
            return false;
        }
    };

    this.endGame = function () {
        if (state === GameState.IN_PROGRESS) {
            state = GameState.ENDED;
            return true;
        } else {
            return false;
        }
    };

    this.cancelGame = function () {
        if (state === GameState.IN_PROGRESS) {
            state = GameState.CANCELLED;
            return true;
        } else {
            return false;
        }
    };

    /* Validation */
    this.validate = function () {
        return validator.validate();
    };

    validator = new Validator({
        validateStateType: function (validator) {
            if (typeof state !== 'string') {
                validator.error('state was not a string. Was a ' + typeof state);
                validator.stop();
            }
        },
        validateStateValue: function (validator) {
            for (var stateKey in possibleStates) {
                if (possibleStates[stateKey] === state) {
                    return;
                }
            }
            validator.error('state "' + state + '" is not a valid state');
        }
    });

    /* JSON */
    this.toJSON = function () {
        return {
            state: state
        };
    };

    // Initialize
    init(options);

};

_.extend(GameState, possibleStates);

exports = module.exports = GameState;