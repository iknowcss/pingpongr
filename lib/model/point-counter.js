var PointCounter

  , Validator = require('../validation/validator')
  , Observable = require('./observable-mixin')
  , _ = require('underscore')

  , defaults = {
        initialScore: [0, 0]
    };

PointCounter = function (score) {

    /* Private variables */
    var validator
      , initialScore
      , points
      , pointCursor;

    /* Initializer */
    function init (score) {
        if (_.isUndefined(score)) {
            initialScore = _.clone(defaults.initialScore);
        } else if (score instanceof PointCounter) {
            initialScore = score.getScore();
        } else {
            verifyScoreArray(score);
            initialScore = _.clone(score);
        }

        points = [];
        pointCursor = 0;
    }

    /* Private functions */
    function stepPointCursor() {
        if (points.length > pointCursor) {
            points.splice(pointCursor);
        }
        pointCursor++;
    }

    /* Getters */
    this.getScore = function () {
        var score = _.clone(initialScore);

        for (var i = 0; i < pointCursor; i++) {
            var point = points[i];
            score[0] += point[0];
            score[1] += point[1];
        }

        return score;
    };

    /* Commands */
    this.pointLeft = function () {
        var score;

        stepPointCursor();
        points.push([1, 0]);

        score = this.getScore();
        this.notify(score);
    };

    this.pointRight = function () {
        var score;

        stepPointCursor();
        points.push([0, 1]);

        score = this.getScore();
        this.notify(score);
    };

    this.undoPoint = function () {
        var doNotify = false
          , score;

        if (pointCursor > 0) {
            pointCursor--;
            doNotify = true;
        }

        score = this.getScore();
        if (doNotify) {
            this.notify(score);
        }
    };

    this.redoPoint = function () {
        var doNotify = false
          , score;

        if (pointCursor < points.length) {
            pointCursor++;
            doNotify = true;
        }

        score = this.getScore();
        if (doNotify) {
            this.notify(score);
        }
    };

    /* Verification */
    function verifyScoreArray (array) {
        if (!_.isArray(array)) {
            throw new Error('score array was not an array');
        }
        if (array.length !== 2) {
            throw new Error('score array did not have length 2');
        }
        if (typeof array[0] !== 'number' || typeof array[1] !== 'number') {
            throw new Error('score array did not contain only numbers');
        }
    }

    /* Validation */
    validator = new Validator({
        validateInitialScore: function (validator) {
            _.each(initialScore, function (score) {
                if (score % 1 !== 0) {
                    validator.err('initial score was not an integer');
                } else if (score < 0) {
                    validator.err('initial score was negative');
                }
            });
        }
    });

    this.validate = function () {
        return validator.validate();
    };

    /* JSON */
    this.toJSON = function () {
        return {
            score: this.getScore()
        };
    }

    // Initialize
    init.call(this, score);

};

exports = module.exports = function (initialScore) {
    return new PointCounter(initialScore);
};

PointCounter.prototype = exports.prototype = _.extend({
    constructor: PointCounter
}, Observable);