var PointCounter = require('../lib/point-counter'),
    PlayerSet = require('../lib/player-set'),
    _ = require('underscore');

describe('A PointCounter', function () {

    var pointCounter;

    beforeEach(function () {
        pointCounter = new PointCounter();
    });

    it('should return an independent, cloned score array', function () {
        var score = pointCounter.getScore();
        score[0] = 9001;
        expect(pointCounter.getScore()).not.toEqual(score);
    });

    it('should not validate with invalid initial score', function () {
        var wrongType = {},
            wrongSize = [1],
            wrongElementType = [1.2, 1.4],
            invalidElementValue = [-1, -2],
            validPoints = [0, 5],
            validation;

        pointCounter = new PointCounter({ initialScore: wrongType });
        validation = pointCounter.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        pointCounter = new PointCounter({ initialScore: wrongSize });
        validation = pointCounter.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(1);

        pointCounter = new PointCounter({ initialScore: wrongElementType });
        validation = pointCounter.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(2);

        pointCounter = new PointCounter({ initialScore: invalidElementValue });
        validation = pointCounter.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(2);

        pointCounter = new PointCounter({ initialScore: validPoints });
        validation = pointCounter.validate();
        expect(validation.valid).toBe(true);
        expect(validation.errors.length).toBe(0);
    });

    it('should allow points to be added to the "left" or "right"', function () {
        pointCounter.pointLeft();
        pointCounter.pointRight();
        pointCounter.pointLeft();
        pointCounter.pointLeft();
        pointCounter.pointRight();

        expect(pointCounter.getScore()).toEqual([3, 2]);
    });

});