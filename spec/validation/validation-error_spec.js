var ValidationError = require('../../lib/validation/validation-error');


describe('A ValidationError', function () {

    var globalValidationError;

    function doConstruct (withArg) {
        return function () {
            globalValidationError = ValidationError(withArg);
        };
    }

    it('may be constructed with a single string message', function () {
        var error = 'Game not found';

        expect(doConstruct(error)).not.toThrow();
        expect(globalValidationError instanceof ValidationError).toBe(true);
        expect(globalValidationError.errors).toEqual([error]);
    });

    it('may be constructed with an array of string messages', function () {
        var errors = [
                'Player 1 had an invalid score',
                'Player 2 had an invalid score',
            ];

        expect(doConstruct(errors)).not.toThrow();
        expect(globalValidationError instanceof ValidationError).toBe(true);
        expect(globalValidationError.errors).toEqual(errors);
    });

    it('throws an exception when a bad construction argument is provided', function () {
        var badType = {}
          , emptyArray = []
          , badArrayElement = ['Normal error', {}];

        expect(doConstruct()).not.toThrow();
        expect(doConstruct(badType)).toThrow();
        expect(doConstruct(emptyArray)).not.toThrow();
        expect(doConstruct(badArrayElement)).toThrow();
    });

    it('constructs with a cloned, independent errors array', function () {
        var errors = ['one', 'two']
          , expectedErrors = _.clone(errors)
          , validationError = ValidationError(errors);

        errors.push('three');
        expect(validationError.errors).toEqual(expectedErrors);
    });

});