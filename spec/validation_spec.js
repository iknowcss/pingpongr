var Validation = require('../lib/validation'),
    _ = require('underscore');

describe('A Validation', function () {

    var validation;

    beforeEach(function () {
        validation = Validation();
    });

    it('should allow errors to be added individually or as an array', function () {
        var testErrs = [ 'error 1', 'error 2', 'error 3' ];
        validation.addError(testErrs[0]);
        validation.addError([ testErrs[1], testErrs[2] ]);

        expect(validation.getErrors()).toEqual(testErrs);
    });

    it('should return an independent, cloned errors array', function () {
        var errors;
        validation.addError('error 1');
        validation.addError('error 2');

        errors = validation.getErrors();
        errors[0] = 'foo';
        expect(validation.getErrors()).not.toEqual(errors);
    });

    it('should have a function to check validity', function () {
        expect(validation.isValid()).toBeTruthy();

        validation.addError('error 1');
        expect(validation.isValid()).toBeFalsy();
    });

    it('should take an array of validator functions', function () {
        var validators = [],
            testString,
            validation;

        validators.push(function () {
            var validation = Validation();
            if (testString[0] !== 'a') {
                validation.addError('first letter should have been "a"');
            }
            return validation;
        });

        validators.push(function () {
            var validation = Validation();
            if (testString[1] !== 'b') {
                validation.addError('second letter should have been "b"');
            }
            return validation;
        });

        validators.push(function () {
            var validation = Validation();
            if (testString[2] !== 'c') {
                validation.addError('third letter should have been "c"');
            }
            return validation;
        });

        validation = Validation();
        testString = 'aBc';
        validation.validateWith(validators);
        expect(validation.isValid()).toBe(false);
        expect(validation.getErrors().length).toBe(1);

        validation = Validation();
        testString = 'AbC';
        validation.validateWith(validators);
        expect(validation.isValid()).toBe(false);
        expect(validation.getErrors().length).toBe(2);

        validation = Validation();
        testString = 'abc';
        validation.validateWith(validators);
        expect(validation.isValid()).toBe(true);
        expect(validation.getErrors().length).toBe(0);
    });

    it('should take a collection of validator functions', function () {
        var validators = {},
            testString,
            validation;

        validators.testX = function () {
            var validation = Validation();
            if (testString[0] !== 'x') {
                validation.addError('first letter should have been "x"');
            }
            return validation;
        };

        validators.testY = function () {
            var validation = Validation();
            if (testString[1] !== 'y') {
                validation.addError('second letter should have been "y"');
            }
            return validation;
        };

        validators.testZ = function () {
            var validation = Validation();
            if (testString[2] !== 'z') {
                validation.addError('third letter should have been "z"');
            }
            return validation;
        };

        validation = Validation();
        testString = 'xYz';
        validation.validateWith(validators);
        expect(validation.isValid()).toBe(false);
        expect(validation.getErrors().length).toBe(1);

        validation = Validation();
        testString = 'XyZ';
        validation.validateWith(validators);
        expect(validation.isValid()).toBe(false);
        expect(validation.getErrors().length).toBe(2);

        validation = Validation();
        testString = 'xyz';
        validation.validateWith(validators);
        expect(validation.isValid()).toBe(true);
        expect(validation.getErrors().length).toBe(0);
    });

    it('should allow error adding to be chainable', function () {
        var validators = [],
            errors;

        validators.push(function () {
            return Validation().addError('Error 2');
        });

        validators.push(function () {
            return Validation().addError('Error 3');
        });

        validation
            .addError('Error 1')
            .validateWith(validators)
            .addError('Error 4');

        errors = validation.getErrors();
        expect(errors.length).toBe(4);
        expect(errors).toEqual([
            'Error 1',
            'Error 2',
            'Error 3',
            'Error 4'
        ]);
    });

});
