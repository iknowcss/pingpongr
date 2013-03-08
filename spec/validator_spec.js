var Validator = require('../lib/validator'),
    _ = require('underscore');

describe('A Validator', function () {

    var validator;

    /* Validation functions */
    function firstLetterIsA (str, validator) {
        if (str[0] != 'a') {
            validator.error('1st letter should be "a"');
        }
    }

    function secondLetterIsB (str, validator) {
        if (str[1] != 'b') {
            validator.error('2nd letter should be "b"').stop();
        }
    }

    function thirdLetterIsC (str, validator) {
        if (str[2] != 'c') {
            validator.error('3rd letter should be "c"');
        }
    }

    function fourthLetterIsD (str, validator) {
        if (str[3] != 'd') {
            validator.error('4th letter should be "d"');
        }
    }

    function fifthLetterIsE (str, validator) {
        if (str[4] != 'e') {
            validator.error('5th letter should be "e"');
        }
    }

    function firstLetterIsX (str, validator) {
        if (str[0] != 'x') {
            validator.error('1st letter should be "x"');
        }
    }

    function secondLetterIsY (str, validator) {
        if (str[1] != 'y') {
            validator.error('2nd letter should be "y"').stop();
        }
    }

    function thirdLetterIsZ (str, validator) {
        if (str[2] != 'z') {
            validator.error('3rd letter should be "z"');
        }
    }

    /* Tests */
    beforeEach(function () {
        validator = new Validator(firstLetterIsA, secondLetterIsB, thirdLetterIsC);
    });

    it('should validate with an array or collection of validation functions', function () {
        var validator,
            expectedErrors,
            validation;

        // Array
        validator = new Validator([
            firstLetterIsX,
            secondLetterIsY,
            thirdLetterIsZ
        ]);
        expectedErrors = [ 
            '1st letter should be "x"',
            '3rd letter should be "z"'
        ];
        validation = validator.validate('ayc');

        expect(validation.valid).toBe(false);
        expect(validation.errors).toEqual(expectedErrors);

        // Collection
        validator = new Validator({
            firstLetterIsA: firstLetterIsA,
            secondLetterIsB: secondLetterIsB,
            thirdLetterIsC: thirdLetterIsC
        });
        expectedErrors = [ 
            '1st letter should be "a"',
            '3rd letter should be "c"'
        ];
        validation = validator.validate('xbz');

        expect(validation.valid).toBe(false);
        expect(validation.errors).toEqual(expectedErrors);
    });

    it('should accept other Validator objects as subvalidators', function () {
        var testString,
            expectedErrors,
            dValidator,
            finalValidator,
            validation;

        testString = 'xbcwv';
        expectedErrors = [
            '1st letter should be "a"',
            '4th letter should be "d"',
            '5th letter should be "e"'
        ];

        dValidator = new Validator(validator, fourthLetterIsD);
        finalValidator = new Validator(dValidator, fifthLetterIsE);
        validation = finalValidator.validate(testString);

        expect(validation.valid).toBe(false);
        expect(validation.errors).toEqual(expectedErrors);
    });

    it('should stop validating an object when specified', function () {
        var expectedErrors = [ 
                '2nd letter should be "b"'
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
