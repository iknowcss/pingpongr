var Validator

  , ValidationError = require('./validation-error')
  , _ = require('underscore')

  , Validation
  , slice = [].slice
  , push = [].push;

/* Private Validation class */
Validation = function () {
    this.valid = undefined;
    this.error = ValidationError();
};

Validation.prototype.append = function (that) {
    if (!(that instanceof Validation)) {
        throw new Error('object to append was not a Validation object');
    }
    this.valid = this.valid && that.valid;
    push.apply(this.error.errors, that.error.errors);
};

Validator = function () {

    /* Private variables */
    var self = this
      , validation
      , validationFns
      , stopped;

    /* Initializer */
    function init () {
        var initValidationFns = [];
        validationFns = [];
        stopped = false;

        if (_.isFunction(arguments[0]) || arguments[0] instanceof Validator) {
            initValidationFns = arguments;
        } else {
            initValidationFns = arguments[0];
        }

        _.each(initValidationFns, function (vfn) {
            if (_.isFunction(vfn) || vfn instanceof Validator) {
                validationFns.push(vfn);
            }
        });
    }

    /* Commands */
    this.err = function (errorMsg) {
        if (_.isUndefined(validation)) {
            throw new Error('validation object is not initialized');
        }
        if (!_.isUndefined(errorMsg)) {
            validation.error.errors.push(errorMsg.toString());
        };
        return this;
    };

    this.append = function (otherValidation) {
        if (_.isUndefined(validation)) {
            throw new Error('validation object is not initialized');
        }
        validation.append(otherValidation);
    };

    this.validate = function (testObj) {
        var scopeValidation = validation = new Validation()
          , subValidation;

        for (var i = 0; !stopped && i < validationFns.length; i++) {
            if (validationFns[i] instanceof Validator) {
                subValidation = validationFns[i].validate(testObj);
                validation.append(subValidation);
            } else {
                validationFns[i].call(null, self, testObj);
            }
        }

        validation.valid = _.isEmpty(validation.error.errors);
        validation = undefined;
        stopped = false;

        return scopeValidation;
    };

    this.stop = function () {
        stopped = true;
    };

    // Initialize
    init.apply(this, arguments);

};

Validator.Validation = Validation;

exports = module.exports = Validator;