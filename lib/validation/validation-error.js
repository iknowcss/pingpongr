var ValidationError

    _ = require('underscore');

ValidationError = function (initErrors) {

    function init (initErrors) {
        if (_.isUndefined(initErrors)) {
            initErrors = [];
        } else if (_.isString(initErrors)) {
            initErrors = [initErrors];
        }
        verifyErrors(initErrors);
        this.errors = _.clone(initErrors);
    }

    function verifyErrors (errors) {
        var isArray = _.isArray(errors)
          , isString = _.isString(errors);

        if (!isArray && !isString) {
            throw new Error('errors is not an array or a string');
        } else if (isArray) {
            _.each(errors, function (error) {
                if (!_.isString(error)) {
                    throw new Error(
                        'errors does not only contain string elements');
                }
            });
        }
    }

    this.toJSON = function () {
        return {
            errors: _.clone(this.errors)
        };
    };

    init.call(this, initErrors);

};

exports = module.exports = function (initErrors) {
    return new ValidationError(initErrors);
};

exports.prototype = ValidationError.prototype = {
    constructor: ValidationError
};