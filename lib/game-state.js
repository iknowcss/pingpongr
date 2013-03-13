var GameState,

    Validator = require('./validator'),
    _ = require('underscore'),

    READY = 'ready',
    IN_PROGRESS = 'in-progress',
    CANCELLED = 'cancelled',
    ENDED = 'ended',
    possibleStates = {
        READY: READY,
        IN_PROGRESS: IN_PROGRESS,
        CANCELLED: CANCELLED,
        ENDED: ENDED
    };

    defaults = {
        state: READY
    };

GameState = function (initialState) {

    /* Private variables */
    var playerSet,
        state,
        validator;

    /* Initializer */
    function init (initialState) {
        var values;
        if (_.isUndefined(initialState)) {
            state = defaults.state;
        } else if (initialState instanceof GameState) {
            state = initialState.getState();
        } else {
            verifyState(initialState);
            state = initialState
        }
    }

    /* Getters */
    this.getState = function () {
        return state;
    };

    /* Commands */
    this.startGame = function () {
        if (state === READY) {
            state = IN_PROGRESS;
            return true;
        } else {
            return false;
        }
    };

    this.endGame = function () {
        if (state === IN_PROGRESS) {
            state = ENDED;
            return true;
        } else {
            return false;
        }
    };

    this.cancelGame = function () {
        if (state === IN_PROGRESS) {
            state = CANCELLED;
            return true;
        } else {
            return false;
        }
    };

    /* Verification */
    function verifyState (state) {
        for (var stateKey in possibleStates) {
            if (possibleStates[stateKey] === state) {
                return;
            }
        }
        throw new Error('The state was not valid');
    }

    /* JSON */
    this.toJSON = function () {
        return {
            state: state
        };
    };

    // Initialize
    init(initialState);

};

exports = module.exports = function (initialState) {
    return new GameState(initialState);
};

exports.prototype = GameState.prototype = {
    constructor: GameState
};

// Add the possible states to the export
_.extend(exports, possibleStates);