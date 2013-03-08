var Validator,
    _ = require('underscore'),
    slice = [].slice;

Validator = function () {

    var self = this,
        errors,
        validationFns,
        stopped;

    function init () {
        var tempValidationFns = [];
        validationFns = [];
        errors = [];
        stopped = false;

        this.valid = true;
        this.errors = [];

        if (_.isFunction(arguments[0])) {
            tempValidationFns = arguments;
        } else {
            tempValidationFns = arguments[0];
        }

        _.each(tempValidationFns, function (vfn) {
            if (_.isFunction(vfn)) {
                validationFns.push(vfn);
            }
        });
    }

    this.error = function (errorMsg) {
        if (!_.isUndefined(errorMsg)) {
            errors.push(errorMsg.toString());
        }
        return this;
    };

    this.validate = function (testObj) {
        for (var i = 0; !stopped && i < validationFns.length; i++) {
            validationFns[i].call(null, testObj, self);
        }
        stopped = false;
        this.valid = _.isEmpty(errors);
        this.errors = errors;
        return this;
    };

    this.stop = function () {
        stopped = true;
    };

    init.apply(this, arguments);

};

exports = module.exports = Validator;