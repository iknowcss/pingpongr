var ValidationError = require('../../lib/validation/validation-error');


describe('A ValidationError', function () {

    var globalValidationError;

    function doConstruct (withArg) {
        return function () {
            globalValidationError = ValidationError(withArg);
        };
    }

    it('may be constructed with a single message', function () {
        var error = 'Game not found';

        expect(doConstruct(error)).not.toThrow();
        expect(globalValidationError instanceof ValidationError).toBe(true);
    })

});