var PointCounter,
    Validator = require('./validator'),
    _ = require('underscore'),
    defaults = {
        points: [0, 0]
    };

PointCounter = function (options) {

    /* Private variables */
    var validator,
        points;

    /* Initializer */
    function init (options) {
        var values = {};
        if (!_.isObject(options)) {
            options = {};
        }
        _.extend(values, defaults, options);

        points = _.clone(values.points);
    }

    /* Getters */
    this.getPoints = function () {
        return _.clone(points);
    };

    /* Validation */
    // TODO

    // Initialize
    init.call(this, options);

};

exports = module.exports = PointCounter;