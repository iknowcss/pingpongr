var PointCounter = require('../lib/point-counter'),
    PlayerSet = require('../lib/player-set'),
    _ = require('underscore');

describe('A PointCounter', function () {

    var globalPointCounter;

    function doConstructWith (initArg) {
        return function () {
            globalPointCounter = PointCounter(initArg);
        };
    }

    it('should initialize with defaults', function () {
        expect(doConstructWith()).not.toThrow();
        expect(globalPointCounter instanceof PointCounter).toBe(true);
        expect(globalPointCounter.getScore()).toEqual([0, 0]);
    });

    it('should initialize with a score array as the constructor argument', function () {
        var validScore = [5, 1];

        expect(doConstructWith(validScore)).not.toThrow();
        expect(globalPointCounter instanceof PointCounter).toBe(true);
        expect(globalPointCounter.getScore()).toEqual(validScore);
    });

    it('should initialize an independent instance with a PointCounter as the constructor argument', function () {
        var initialScore = [1, 5],
            otherPointCounter = PointCounter(initialScore);

        expect(doConstructWith(otherPointCounter)).not.toThrow();
        expect(globalPointCounter instanceof PointCounter).toBe(true);
        expect(globalPointCounter.getScore()).toEqual(initialScore);

        otherPointCounter.pointLeft();
        expect(otherPointCounter.getScore()).toEqual([2, 5]);
        expect(globalPointCounter.getScore()).toEqual(initialScore);
    });

    it('should not initialize with a bad constructor argument', function () {
        var wrongType = 1,
            wrongSize = [1],
            wrongElementType = ["0", "0"],
            invalidButNotBad = [-1, 0];

        expect(doConstructWith(wrongType)).toThrow();
        expect(doConstructWith(wrongSize)).toThrow();
        expect(doConstructWith(wrongElementType)).toThrow();
        expect(doConstructWith(invalidButNotBad)).not.toThrow();
    });

    it('should not validate with an invalid score', function () {
        var wrongNumberType = [5.5, 0.2],
            negativeNumber = [-1, -5],
            validation;

        validation = PointCounter(wrongNumberType).validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(2);

        validation = PointCounter(negativeNumber).validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBe(2);
    });

    it('should return an independent, cloned score array', function () {
        var pointCounter = PointCounter(),
            score = pointCounter.getScore();
        score[0] = 9001;
        expect(pointCounter.getScore()).not.toEqual(score);
    });

    it('should allow points to be added to the "left" or "right"', function () {
        var pointCounter = PointCounter(),
            score;

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

    it('should allow points to be undone', function () {
        var pointCounter = PointCounter(),
            score;

        // Undo before even started
        score = pointCounter.undoPoint();  // 0 to 0
        expect(score).toEqual([0, 0]);

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
    });

    it('should allow points to be redone after being undone', function () {
        var pointCounter = PointCounter(),
            score;

        // Prepare a state and then undo thrice
        pointCounter.pointRight(); // 0 to 1
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

        // Redo beyond current score
        score = pointCounter.redoPoint(); // 3 to 2 (still)
        expect(score).toEqual([3, 2]);
    });

    it('should generate an up-to-date JSON', function () {
        var pointCounter = PointCounter(),
            initialPointsJSON = { score: [0, 0] },
            leftPointsJSON = { score: [1, 0] },
            bothPointsJSON = { score: [1, 1] },
            undoneJSON = { score: [1, 0] };

        expect(pointCounter.toJSON()).toEqual(initialPointsJSON);

        pointCounter.pointLeft();
        expect(pointCounter.toJSON()).toEqual(leftPointsJSON);

        pointCounter.pointRight();
        expect(pointCounter.toJSON()).toEqual(bothPointsJSON);

        pointCounter.undoPoint();
        expect(pointCounter.toJSON()).toEqual(undoneJSON);
    });

    it('should notify observers only when the score changes', function () {
        var newScore,
            pointCounter = PointCounter(),
            spy = jasmine.createSpy('"new score callback"'),
            callback = function (score) {
                newScore = score;
            };

        pointCounter.observe(spy);
        pointCounter.observe(callback);

        pointCounter.pointLeft();
        expect(newScore).toEqual([1, 0]);
        expect(spy.callCount).toBe(1);

        pointCounter.pointRight();
        expect(newScore).toEqual([1, 1]);
        expect(spy.callCount).toBe(2);

        pointCounter.undoPoint();
        expect(newScore).toEqual([1, 0]);
        expect(spy.callCount).toBe(3);

        pointCounter.redoPoint();
        expect(newScore).toEqual([1, 1]);
        expect(spy.callCount).toBe(4);

        pointCounter.redoPoint();
        expect(newScore).toEqual([1, 1]);
        expect(spy.callCount).toBe(4);
    });

});