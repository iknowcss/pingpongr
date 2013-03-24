var Validator = require('../../lib/validation/validator'),
    _ = require('underscore');

describe('A Validator', function () {

    var validator;

    /* Validation functions */
    function firstLetterIsA (validator, str) {
        if (str[0] != 'a') {
            validator.error('1st letter should be "a"');
        }
    }

    function secondLetterIsB (validator, str) {
        if (str[1] != 'b') {
            validator.error('2nd letter should be "b"').stop();
        }
    }

    function thirdLetterIsC (validator, str) {
        if (str[2] != 'c') {
            validator.error('3rd letter should be "c"');
        }
    }

    function fourthLetterIsD (validator, str) {
        if (str[3] != 'd') {
            validator.error('4th letter should be "d"');
        }
    }

    function fifthLetterIsE (validator, str) {
        if (str[4] != 'e') {
            validator.error('5th letter should be "e"');
        }
    }

    function firstLetterIsX (validator, str) {
        if (str[0] != 'x') {
            validator.error('1st letter should be "x"');
        }
    }

    function secondLetterIsY (validator, str) {
        if (str[1] != 'y') {
            validator.error('2nd letter should be "y"').stop();
        }
    }

    function thirdLetterIsZ (validator, str) {
        if (str[2] != 'z') {
            validator.error('3rd letter should be "z"');
        }
    }

    /* Tests */
    beforeEach(function () {
        validator = new Validator(firstLetterIsA, secondLetterIsB, thirdLetterIsC);
    });

    it('should have a function to evaluate validity', function () {
        var validation,
            validStr = 'abc',
            invalidStr = 'axc';

        validation = validator.validate(validStr);
        expect(validation.valid).toBe(true);
        expect(validation.errors.length).toBe(0);

        validation = validator.validate(invalidStr);
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).not.toBe(0);
    });

    it('should throw an exception if an error is added when validation is not in progress', function () {
        var badCall = function () {
            validation.error('foo');
        };

        expect(badCall).toThrow();
    });

    it('should validate with an array or collection of validation functions', function () {
        var validator,
            validation,
            expectedErrors;

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

    it('should allow other validations to be appended', function () {
        var testStr = 'xyz',
            firstLetterValidator = new Validator(firstLetterIsA),
            expectedErrors = [
                'was not at least 4 letters',
                '1st letter should be "a"'
            ],
            validation;

        validator = new Validator(function (validator, str) {
            var vn;
            if (str.length < 4) {
                validator.error('was not at least 4 letters');
            }
            vn = firstLetterValidator.validate(str);
            validator.append(vn);
        });

        validation = validator.validate(testStr);
        expect(validation.errors).toEqual(expectedErrors);
    });

    it('should only allow Validation objects to be appended', function () {
        var validator = new Validator(function (validator, str) {
                validator.append({});
            }),
            badCall = function () {
                validator.validate();
            };

        expect(badCall).toThrow();
    });

    it('should stop validating an object when specified', function () {
        var expectedErrors = [ 
                '2nd letter should be "b"'
            ],
            validation = validator.validate('ayc');

        expect(validation.valid).toBe(false);
        expect(validation.errors).toEqual(expectedErrors);
    });

});
