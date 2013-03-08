var Validator = require('../lib/validator'),
    _ = require('underscore');

describe('A Validator', function () {

    var validator,
        collectionValidationFunctions = {
            stringStartsWithA: function (str, validator) {
                if (str[0] != 'a') {
                    validator.error('String should start with "a"');
                }
            },
            stringStartsWithB: function (str, validator) {
                if (str[1] != 'b') {
                    validator.error('String should start with "b"').stop();
                }
            },
            stringStartsWithC: function (str, validator) {
                if (str[2] != 'c') {
                    validator.error('String should start with "c"');
                }
            }
        },
        arrayValidationFunctions = [
            function (str, validator) {
                if (str[0] != 'x') {
                    validator.error('String should start with "x"');
                }
            },
            function (str, validator) {
                if (str[1] != 'y') {
                    validator.error('String should start with "y"').stop();
                }
            },
            function (str, validator) {
                if (str[2] != 'z') {
                    validator.error('String should start with "z"');
                }
            }
        ];

    beforeEach(function () {
        validator = new Validator(collectionValidationFunctions);
    });

    it('should validate with a collection of validation functions', function () {
        var validator = new Validator(collectionValidationFunctions),
            expectedErrors = [ 
                'String should start with "a"',
                'String should start with "c"'
            ],
            validation = validator.validate('xbz');

        expect(validation.valid).toBe(false);
        expect(validation.errors).toEqual(expectedErrors);
    });

    it('should validate with an array of validation functions', function () {
        var validator = new Validator(arrayValidationFunctions),
            expectedErrors = [ 
                'String should start with "x"',
                'String should start with "z"'
            ],
            validation = validator.validate('ayc');

        expect(validation.valid).toBe(false);
        expect(validation.errors).toEqual(expectedErrors);
    });

    it('should accept other Validators as subvalidators', function () {
        var regularValidationFunction = function (str, validator) {
                if (str[3] != 'd') {
                    validator.error('String should end with "d"');
                }
            },
            testString = 'xbcw',
            expectedErrors = [
                'String should start with "a"',
                'String should end with "d"'
            ],
            superValidator = new Validator(validator, regularValidationFunction),
            validation = superValidator.validate(testString);

        expect(validation.valid).toBe(false);
        expect(validation.errors).toEqual(expectedErrors);
    });

    it('should stop validating an object when specified', function () {
        var expectedErrors = [ 
                'String should start with "b"'
            ],
            validation = validator.validate('ayc');

        expect(validation.valid).toBe(false);
        expect(validation.errors).toEqual(expectedErrors);
    });

    // it('should have a function to check validity', function () {
    //     expect(validation.isValid()).toBeTruthy();

    //     validation.error('error 1');
    //     expect(validation.isValid()).toBeFalsy();
    // });

    // it('should take an array of validator functions', function () {
    //     var validators = [],
    //         testString,
    //         validation;

    //     validators.push(function () {
    //         var validation = new Validator();
    //         if (testString[0] !== 'a') {
    //             validation.error('first letter should have been "a"');
    //         }
    //         return validation;
    //     });

    //     validators.push(function () {
    //         var validation = new Validator();
    //         if (testString[1] !== 'b') {
    //             validation.error('second letter should have been "b"');
    //         }
    //         return validation;
    //     });

    //     validators.push(function () {
    //         var validation = new Validator();
    //         if (testString[2] !== 'c') {
    //             validation.error('third letter should have been "c"');
    //         }
    //         return validation;
    //     });

    //     validation = new Validator();
    //     testString = 'aBc';
    //     validation.validateWith(validators);
    //     expect(validation.isValid()).toBe(false);
    //     expect(validation.getErrors().length).toBe(1);

    //     validation = new Validator();
    //     testString = 'AbC';
    //     validation.validateWith(validators);
    //     expect(validation.isValid()).toBe(false);
    //     expect(validation.getErrors().length).toBe(2);

    //     validation = new Validator();
    //     testString = 'abc';
    //     validation.validateWith(validators);
    //     expect(validation.isValid()).toBe(true);
    //     expect(validation.getErrors().length).toBe(0);
    // });

    // it('should take a collection of validator functions', function () {
    //     var validators = {},
    //         testString,
    //         validation;

    //     validators.testX = function () {
    //         var validation = new Validator();
    //         if (testString[0] !== 'x') {
    //             validation.error('first letter should have been "x"');
    //         }
    //         return validation;
    //     };

    //     validators.testY = function () {
    //         var validation = new Validator();
    //         if (testString[1] !== 'y') {
    //             validation.error('second letter should have been "y"');
    //         }
    //         return validation;
    //     };

    //     validators.testZ = function () {
    //         var validation = new Validator();
    //         if (testString[2] !== 'z') {
    //             validation.error('third letter should have been "z"');
    //         }
    //         return validation;
    //     };

    //     validation = new Validator();
    //     testString = 'xYz';
    //     validation.validateWith(validators);
    //     expect(validation.isValid()).toBe(false);
    //     expect(validation.getErrors().length).toBe(1);

    //     validation = new Validator();
    //     testString = 'XyZ';
    //     validation.validateWith(validators);
    //     expect(validation.isValid()).toBe(false);
    //     expect(validation.getErrors().length).toBe(2);

    //     validation = new Validator();
    //     testString = 'xyz';
    //     validation.validateWith(validators);
    //     expect(validation.isValid()).toBe(true);
    //     expect(validation.getErrors().length).toBe(0);
    // });

    // it('should allow error adding to be chainable', function () {
    //     var validators = [],
    //         errors;

    //     validators.push(function () {
    //         return new Validator().error('Error 2');
    //     });

    //     validators.push(function () {
    //         return new Validator().error('Error 3');
    //     });

    //     validation
    //         .error('Error 1')
    //         .validateWith(validators)
    //         .error('Error 4');

    //     errors = validation.getErrors();
    //     expect(errors.length).toBe(4);
    //     expect(errors).toEqual([
    //         'Error 1',
    //         'Error 2',
    //         'Error 3',
    //         'Error 4'
    //     ]);
    // });

});
