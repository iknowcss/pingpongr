var ValidationError;

ValidationError = function (initErrors) {

};

exports = module.exports = function (initErrors) {
    return new ValidationError(initErrors);
};

exports.prototype = ValidationError.prototype = {
    constructor: ValidationError
};