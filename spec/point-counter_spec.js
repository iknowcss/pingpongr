var _ = require('underscore'),
    PointCounter = require('../lib/point-counter');

describe('A PointCounter', function () {

    var pointCounter,
        players = ['Player 1', 'Player 2'];

    beforeEach(function () {
        pointCounter = PointCounter({
            players: players
        });
    });

    it('should not initialize without players', function () {
        var pointCounter,
            badInit = function () {
                pointCounter = PointCounter();
            };
        expect(badInit).toThrow();
    })

    it('should initalize with the proper defaults', function () {
        expect(pointCounter.getPoints()).toEqual([0, 0]);
    });

    it('should return an independent, cloned points array', function () {
        var newPoints = pointCounter.getPoints();
        newPoints[0] = 1;
        expect(pointCounter.getPoints()).not.toEqual(newPoints);
    });

});