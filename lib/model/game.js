var Game
  , GameState = require('./game-state')
  , PlayerSet = require('./player-set')
  , PointCounter = require('./point-counter')
  , Observable = require('./observable-mixin')
  , Validator = require('../validation/validator')
  , _ = require('underscore');

Game = function (options) {

  var self = this
    , validator;

  function init (options) {
    if (!_.isObject(options)) {
      options = {};
    }

    this.gameState = GameState(options.state);
    this.playerSet = PlayerSet(options.players);
    this.pointCounter = PointCounter(options.score);

    this.gameState.observe(notifyChange, this);
    this.pointCounter.observe(notifyChange, this);
  }

  /* Observation */
  function notifyChange () {
    this.notify(this.toJSON());
  }

  /* Validation */
  this.validate = function () {
    return validator.validate();
  };

  validator = new Validator({
    validatePlayerSet: function () {
      validator.append(self.playerSet.validate());
    },
    validatePointCounter: function () {
      validator.append(self.pointCounter.validate());
    }
  });

  /* JSON */
  this.toJSON = function () {
    return {
      state: this.gameState.getState(),
      score: this.pointCounter.getScore(),
      players: this.playerSet.getPlayers()
    };
  };

  // Initialize
  init.call(this, options);

};

exports = module.exports = function (options) {
  return new Game(options);
};

exports.prototype = Game.prototype = _.extend({
  constructor: Game
}, Observable);