var PointCounter = require('../lib/point-counter'),
    PlayerSet = require('../lib/player-set'),
    _ = require('underscore');

describe('A PointCounter', function () {

    var pointCounter;

    beforeEach(function () {
        pointCounter = new PointCounter();
    });

    it('should return an independent, cloned points array', function () {
        var points = pointCounter.getPoints();
        points[0] = 9001;
        expect(pointCounter.getPoints()).not.toEqual(points);
    });

});