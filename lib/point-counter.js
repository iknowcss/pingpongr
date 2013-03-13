var PointCounter,
    Validator = require('./validator'),
    _ = require('underscore'),
    defaults = {
        initialScore: [0, 0]
    };

PointCounter = function (initialScore) {
    return new PointCounter.prototype.init(initialScore);
}

PointCounter.prototype = {
    
    constructor: PointCounter,

    init: function (_initialScore) {

        /* Private variables */
        var validator,
            initialScore,
            points,
            pointCursor;

        /* Initializer */
        function init (_initialScore) {
            if (_.isUndefined(_initialScore)) {
                initialScore = _.clone(defaults.initialScore);
            } else {
                verifyScoreArray(_initialScore);
                initialScore = _.clone(_initialScore);
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
            };
            return score;
        };

        /* Commands */
        this.pointLeft = function () {
            stepPointCursor();
            points.push([1, 0]);
            return this.getScore();
        };

        this.pointRight = function () {
            stepPointCursor();
            points.push([0, 1]);
            return this.getScore();
        };

        this.undoPoint = function () {
            if (pointCursor > 0) {
                pointCursor--;
            };
            return this.getScore();
        };

        this.redoPoint = function () {
            if (pointCursor < points.length) {
                pointCursor++;
            }
            return this.getScore(); 
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
            validateInitialScore : function (validator) {
                // TODO: validate integers
                // TODO: validate non-negative
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

        // Initialize and return
        init(_initialScore);
        return this;
    }

};

PointCounter.prototype.init.prototype = PointCounter.prototype;

exports = module.exports = PointCounter;