var Scoreboard

  , Game = require('./game')
  , GameState = require('./game-state')
  , Observable = require('../mixin/observable-mixin')
  , _ = require('underscore')

  , defaultGame = Game({ state: GameState.ENDED });

Scoreboard = function (initialGame) {

    /* Private variables */
    var gameJSON;

    /* Initializer */
    function init (initialGame) {
        if (_.isUndefined(initialGame)) {
            this.update(defaultGame);
        } else {
            this.update(initialGame);
        }
    }

    /* Commands */
    this.update = function (game) {
        var newJSON;
        if (!(game instanceof Game)) {
            throw new Error('provided game was not a Game');
        }

        newJSON = game.toJSON();
        if (!_.isEqual(newJSON, gameJSON)) {
            gameJSON = newJSON;
            this.notify(this.toJSON());
        }
    };

    /* JSON */
    this.toJSON = function () {
        return _.clone(gameJSON);
    };

    // Initialize
    init.call(this, initialGame);

};

exports = module.exports = function (initialGame) {
    return new Scoreboard(initialGame);
};

exports.prototype = Scoreboard.prototype = _.extend({
    constructor: Scoreboard
}, Observable);