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
        var score;

        score = pointCounter.pointLeft();
        expect(score).toEqual([1, 0]);
        score = pointCounter.pointRight();
        expect(score).toEqual([1, 1]);
        score = pointCounter.pointLeft();
        expect(score).toEqual([2, 1]);
        score = pointCounter.pointLeft();
        expect(score).toEqual([3, 1]);
        score = pointCounter.pointRight();
        expect(score).toEqual([3, 2]);

        expect(pointCounter.getScore()).toEqual([3, 2]);
    });

    it('should allow points to be undone and redone', function () {
        var score;

        // Undo points
        pointCounter.pointLeft();          // 1 to 0
        pointCounter.pointRight();         // 1 to 1
        score = pointCounter.undoPoint();  // 1 to 0
        expect(score).toEqual([1, 0]);
        score = pointCounter.undoPoint();  // 0 to 0
        expect(score).toEqual([0, 0]);
        score = pointCounter.undoPoint();  // 0 to 0 (still)
        expect(score).toEqual([0, 0]);

        // Continue after undoing "too far"
        score = pointCounter.pointRight(); // 0 to 1
        expect(score).toEqual([0, 1]);

        // Prepare a state and then undo thrice
        pointCounter.pointRight(); // 0 to 2
        pointCounter.pointLeft();  // 1 to 2
        pointCounter.pointLeft();  // 2 to 2
        pointCounter.pointRight(); // 2 to 3 *
        pointCounter.undoPoint();  // 2 to 2
        pointCounter.undoPoint();  // 1 to 2
        pointCounter.undoPoint();  // 0 to 2

        // Test redo
        score = pointCounter.redoPoint(); // 1 to 2
        expect(score).toEqual([1, 2]);
        score = pointCounter.redoPoint(); // 2 to 2
        expect(score).toEqual([2, 2]);

        // Overwrite the 3rd point
        score = pointCounter.pointLeft(); // 3 to 2
        expect(score).toEqual([3, 2]);

        // Redo past current score
        score = pointCounter.redoPoint(); // 3 to 2 (still)
        expect(score).toEqual([3, 2]);
    });

});