var _ = require('underscore');

exports = module.exports = function () {

    var Validation = {},
        errors;

    function init () {
        errors = [];
    }

    function addErrors (newErrors) {
        _.each(newErrors, function (newError) {
            Validation.addError(newError);
        });
    }

    Validation.addError = function (newError) {
        if (_.isString(newError)) {
            errors.push(newError.toString());
        } else if (_.isArray(newError)) {
            addErrors(newError);
        }
        return this;
    };

    Validation.validateWith = function (validators) {
        _.each(validators, function (validator) {
            var validation;
            if (!_.isFunction(validator)) {
                return;
            }
            validation = validator.call();
            Validation.addError(validation.getErrors());
        });
        return this;
    };

    Validation.getErrors = function () {
        return _.clone(errors);
    };

    Validation.isValid = function () {
        return _.isEmpty(errors);
    };

    init();
    return Validation;

};