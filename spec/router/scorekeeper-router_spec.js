var ScorekeeperRouter = require('../../lib/router/scorekeeper-router')
  , GameController = require('../../lib/controller/game-controller')
  , GameState = require('../../lib/model/game-state')
  , Game = require('../../lib/model/game')
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

  , scoreboard = GameController.getScoreboard()
  , port = 8888
  , namespace = '/scorekeeper'
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

// Prepare the server and attach the ScorekeeperRouter
server = require('http').createServer();
ScorekeeperRouter.listen(server, ioRouterOptions);

// Start the server listening
server.listen(port);

describe('A ScorekeeperRouter', function () {
    
    var socket
      , mockClient;

    // Before each, open the client socket
    beforeEach(function () {
        GameController.newGame();
        connectionState.disconnected();
        socket = io.connect(connectionString, ioClientOptions);
        socket.on('connect', connectionState.connected);
    });

    // After each, disconnect the socket
    afterEach(function () {
        if (socket && socket.socket.connected) {
            socket.disconnect();
        }
    });

    // Mock client and functions
    mockClient = new function () {

        this.handleUpdate = function (data) {
            mockClient.gameJSON = data;
        };

    };

    it('emits the current game JSON on connection', function () {
        var updateSpy = spyOn(mockClient, 'handleUpdate').andCallThrough()
          , gameJSON;

        // Register the spied function to receive data from the server
        socket.on('game', updateSpy);

        // Wait for client to connect
        waitsFor(connectionState.isConnected, 'client to connect', 1000);

        // Wait for client to get data
        waitsFor(function () { return updateSpy.wasCalled; }, 'socket to emit', 1000);

        // Build a Game object from the returned data
        runs(function () {
            expect(mockClient.gameJSON).toEqual(scoreboard.toJSON());
        });
    });

    it('emits the current game JSON on scoreboard update', function () {
        var updateSpy = spyOn(mockClient, 'handleUpdate').andCallThrough()
          , gameJSON;

        socket.on('game', updateSpy);

        waitsFor(connectionState.isConnected, 'client to connect', 1000);
        waitsFor(function () { return updateSpy.wasCalled; }, 'socket to emit', 1000);

        runs(function () {
            updateSpy.reset();
            GameController.startGame();
        });

        waitsFor(function () { return updateSpy.wasCalled; }, 'socket to emit', 1000);

        runs(function () {
            updateSpy.reset();
            expect(mockClient.gameJSON).toEqual(scoreboard.toJSON());

            GameController.pointLeft();
        });

        waitsFor(function () { return updateSpy.wasCalled; }, 'socket to emit', 1000);

        runs(function () {
            expect(mockClient.gameJSON).toEqual(scoreboard.toJSON());
        });

    });

    it('emits the current game JSON upon request', function () {
        var updateSpy = spyOn(mockClient, 'handleUpdate').andCallThrough()
          , gameJSON
          , game = Game({
                    players: ['Dan', 'Carl'],
                    score:   [5, 0],
                    state:   GameState.IN_PROGRESS
                });

        // Set the game
        GameController.setGame(game);
        expect(scoreboard.toJSON()).toEqual(game.toJSON());

        socket.on('game', updateSpy);

        waitsFor(connectionState.isConnected, 'client to connect', 1000);
        waitsFor(function () { return updateSpy.wasCalled; }, 'socket to emit', 1000);

        runs(function () {
            updateSpy.reset();
            mockClient.gameJSON = {};
            socket.emit('request-game');
        });

        waitsFor(function () { return updateSpy.wasCalled; }, 'socket to emit', 1000);

        runs(function () {
            expect(mockClient.gameJSON).toEqual(scoreboard.toJSON());
        });

    });

    // Stop the server listening
    it('closes the server', function () {
        server.close();
    });

});