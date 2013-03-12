var PointCounter,
    Validator = require('./validator'),
    _ = require('underscore'),
    defaults = {
        initialScore: [0, 0]
    };

PointCounter = function (options) {

    /* Private variables */
    var validator,
        initialScore,
        points,
        pointCursor;

    /* Initializer */
    function init (options) {
        var values = {};
        if (!_.isObject(options)) {
            options = {};
        }
        _.extend(values, defaults, options);

        points = [];
        pointCursor = 0;
        initialScore = _.clone(values.initialScore);
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

    /* Validation */
    validator = new Validator({
        validatePoints : function (validator) {
            if (!_.isArray(initialScore)) {
                validator.error('initialScore is not an Array');
                return;
            }
            if (initialScore.length !== 2) {
                validator.error('initialScore array does not have exactly 2 elements');
                return;
            }
            if (!_.isNumber(initialScore[0]) || initialScore[0] < 0 || initialScore[0] % 1 > 0) {
                validator.error('left initialScore value is not a non-negative integer');
            }
            if (!_.isNumber(initialScore[1]) || initialScore[1] < 0 || initialScore[1] % 1 > 0) {
                validator.error('right initialScore value is not a non-negative integer');
            }
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
    init.call(this, options);

};

exports = module.exports = PointCounter;