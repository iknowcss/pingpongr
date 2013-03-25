var ValidationError

    _ = require('underscore');

ValidationError = function (initErrors) {

    function init (initErrors) {
        verifyErrors(initErrors);
        if (_.isString(initErrors)) {
            initErrors = [initErrors];
        }
        this.length = initErrors.length;
        this.errors = _.clone(initErrors);
    }

    function verifyErrors (errors) {
        var isArray = _.isArray(errors)
          , isString = _.isString(errors);

        if (_.isUndefined(errors)) {
            throw new Error('errors is undefined');
        } else if (!isArray && !isString) {
            throw new Error('errors is not an array or a string');
        } else if (isArray) {
            if (errors.length === 0) {
                throw new Error('errors array is empty');
            }
            _.each(errors, function (error) {
                if (!_.isString(error)) {
                    throw new Error(
                        'errors does not only contain string elements');
                }
            });
        }
    }

    init.call(this, initErrors);

};

exports = module.exports = function (initErrors) {
    return new ValidationError(initErrors);
};

exports.prototype = ValidationError.prototype = {
    constructor: ValidationError
};