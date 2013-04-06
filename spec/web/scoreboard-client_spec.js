var ScoreboardClient = require('../../web/resource/js/scoreboard-client')
  , Game = require('../../lib/model/game')
  , _ = require('underscore')

  , routerOptions = {
        'close timeout': 0.2,
        'client store expiration': 0.2,
        'log': false
    }
  , clientOptions = {
        'reconnect': false,
        'force new connection': true
    }

  , server
  , port = 8888
  , namespace = '/scoreboard'
  , mockRouter
  , mockNamespace;

describe('A ScoreboardClient', function () {

    var sbClient
      , notifySpy
      , emitSpy = {
            requestGame: jasmine.createSpy()
        };

    function doConstruct (options) {
        return function () {
            options = _.extend({}, options, {
                port: port,
                ioOptions: clientOptions
            });
            sbClient = ScoreboardClient(options);
            notifySpy = jasmine.createSpy('"game change notify"');
            sbClient.observe(notifySpy);
        };
    }

    function handleConnection (socket) {
        socket.on('request-game', emitSpy.requestGame);
    }

    beforeEach(function () {
        var key;
        for (key in emitSpy) {
            emitSpy[key].reset();
        }
        if (notifySpy) {
            notifySpy.reset();
        }
    });

    it('opens the server', function () {
        // Prepare the server and attach the mockRouter
        server = require('http').createServer();
        mockRouter = require('socket.io').listen(server, routerOptions);
        mockNamespace = mockRouter
            .of(namespace)
            .on('connection', handleConnection);

        // Start the server listening
        server.listen(port);
    });

    it('constructs a client object that connects', function () {
        runs(function () {
            expect(doConstruct()).not.toThrow();
            expect(sbClient instanceof ScoreboardClient).toBe(true);

            sbClient.connect();
        });
        waitsFor(function () {
            return sbClient.isConnected();
        });
    });

    it('receives gameJSONs and notifies observers', function () {
        var testGameJSON = Game().toJSON();

        runs(function () {
            mockNamespace.emit('game', testGameJSON);
        });
        waitsFor(function () {
            return notifySpy.wasCalled;
        });
        runs(function () {
            expect(notifySpy).toHaveBeenCalledWith('game', testGameJSON);
        });
    });

    it('emits request-game requests to get game info', function () {
        runs(function () {
            sbClient.refreshGame();
        });

        waitsFor(function () {
            return emitSpy.requestGame.wasCalled;
        }, 'request-game to be emitted', 1000);

        runs(function () {
            expect(emitSpy.requestGame).toHaveBeenCalled();
        });
    });

    it('notifies observers of errors when the router emits errors', function () {
        var expectedError = {
                type: 'exception',
                message: 'A general exception occured'
            };

        runs(function () {
            mockNamespace.emit('error', expectedError);
        });
        waitsFor(function () {
            return notifySpy.wasCalled;
        }, 'observers to be notified of an error', 1000);
        runs(function() {
            expect(notifySpy).toHaveBeenCalledWith('error', expectedError);
        });
    });

    it('notifies observers of errors when client not connected and commands are being issued', function () {
        var expectedError = {
                type: 'exception',
                message: 'client is not connected'
            };

        runs(function () {
            sbClient.disconnect();
        });
        waitsFor(function () {
            return !sbClient.isConnected();
        });
        runs(function () {
            sbClient.refreshGame();
            expect(notifySpy).toHaveBeenCalledWith('error', expectedError);
        });
    });

    it('closes the server', function () {
        runs(function () {
            server.close();
        });
        waitsFor(function () {
            return !sbClient.isConnected();
        });
    });
    
});