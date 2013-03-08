var PointCounter = require('../lib/point-counter'),
    PlayerSet = require('../lib/player-set'),
    _ = require('underscore');

describe('A PointCounter', function () {

    var pointCounter;

    beforeEach(function () {
        pointCounter = new PointCounter({
            players: new PlayerSet('Player 1', 'Player 2')
        });
    });

    it('should not initialize without valid players', function () {
        var badInitType = function () {
                new PointCounter();
            },
            badInitInvalid = function () {
                new PointCounter({
                    players: new PlayerSet('Lonely Player')
                });
            };

        expect(badInitType).toThrow();
        expect(badInitInvalid).toThrow();
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