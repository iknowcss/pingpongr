var PointCounter,
    Validator = require('./validator'),
    _ = require('underscore'),
    defaults = {
        initialScore: [0, 0]
    };

PointCounter = function (options) {

    /* Private variables */
    var self = this,
        validator,
        initialScore,
        points;

    /* Initializer */
    function init (options) {
        var values = {};
        if (!_.isObject(options)) {
            options = {};
        }
        _.extend(values, defaults, options);

        points = [];
        initialScore = _.clone(values.initialScore);
    }

    /* Getters */
    this.getScore = function () {
        var score = _.clone(initialScore);
        _.each(points, function (point) {
            score[0] += point[0];
            score[1] += point[1];
        });
        return score;
    };

    /* Commands */
    this.pointLeft = function () {
        points.push([1, 0]);
        return self.getScore();
    };

    this.pointRight = function () {
        points.push([0, 1]);
        return self.getScore();
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

    // Initialize
    init.call(this, options);

};

exports = module.exports = PointCounter;