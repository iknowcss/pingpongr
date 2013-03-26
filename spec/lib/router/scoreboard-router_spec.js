var ScoreboardRouter = require('../../../lib/router/scoreboard-router')
  , GameController = require('../../../lib/controller/game-controller')
  , GameState = require('../../../lib/model/game-state')
  , Game = require('../../../lib/model/game')
  , _ = require('underscore')
  , io = require('socket.io-client')

  , ioClientOptions = {
        'reconnect': false,
        'force new connection': true
    }
  , ioRouterOptions = {
        'close timeout': 0.2,
        'client store expiration': 0.2,
        'log': false
    }

  , server
  , scoreboard = GameController.getScoreboard()
  , port = 8888
  , namespace = '/scoreboard'
  , connectionString = ':' + port + namespace
  , connection;

// State tracker for the connection
connectionState = new function () {
    var connected = false;
    this.connected = function () {
        connected = true;
    };
    this.disconnected = function () {
        connected = false;
    };
    this.isConnected = function () {
        return connected;
    };
};

describe('A ScoreboardRouter', function () {
    
    var socket
      , mockClient
      , updateSpy;

    /* Mock client and functions */
    mockClient = new function () {

        this.handleUpdate = function (data) {
            mockClient.gameJSON = data;
        };

    };

    /* Handlers */
    function gameDataReceived () {
        if (updateSpy.wasCalled) {
            updateSpy.reset();
            return true;
        } else {
            return false;
        }
    }

    // Before each, open the client socket
    beforeEach(function () {
        if (!server) {
            return;
        }

        runs(function () {
            // Put everything into a clean initial state
            GameController.newGame();
            connectionState.disconnected();
            mockClient.gameJSON = undefined;

            // Spy on the mockClient
            updateSpy = spyOn(mockClient, 'handleUpdate').andCallThrough();

            // Prepare the connection and bindings
            socket = io.connect(connectionString, ioClientOptions);
            socket.on('connect', connectionState.connected);
            socket.on('game', updateSpy);
        });

        // Wait for connection to occur before continuing
        waitsFor(connectionState.isConnected, 'client to connect', 1000);
    });

    // After each, disconnect the socket
    afterEach(function () {
        if (socket && socket.socket.connected) {
            socket.disconnect();
        }
    });

    it('opens the server', function () {
        // Prepare the server and attach the ScoreboardRouter
        server = require('http').createServer();
        ScoreboardRouter.listen(server, ioRouterOptions);

        // Start the server listening
        server.listen(port);
    });

    it('emits the current game JSON on connection', function () {
        waitsFor(gameDataReceived, 'game data to be received', 1000);

        // Build a Game object from the returned data
        runs(function () {
            expect(mockClient.gameJSON).toEqual(scoreboard.toJSON());
        });
    });

    it('emits the current game JSON on scoreboard update', function () {
        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            GameController.startGame();
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            expect(mockClient.gameJSON).toEqual(scoreboard.toJSON());
            GameController.pointLeft();
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            expect(mockClient.gameJSON).toEqual(scoreboard.toJSON());
        });
    });

    it('emits the current game JSON upon request', function () {
        var game = Game({
                players: ['Dan', 'Carl'],
                score:   [5, 0],
                state:   GameState.IN_PROGRESS
            });

        // Set the game
        GameController.setGame(game);
        expect(scoreboard.toJSON()).toEqual(game.toJSON());

        // Wait for data
        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            mockClient.gameJSON = {};
            socket.emit('request-game');
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            expect(mockClient.gameJSON).toEqual(scoreboard.toJSON());
        });
    });

    var socket2;

    // Stop the server listening
    it('closes the server', function () {
        runs(function () {
            io.connect(null, {'force new connection': true});
            try {
                server.close();
            } catch (e) {}
        });
        waitsFor(function () {
            return !socket.socket.connected;
        });
    });

});