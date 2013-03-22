var ScoreboardRouter = require('../../lib/router/scoreboard-router')
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

// Prepare the server and attach the ScoreboardRouter
server = require('http').createServer();
ScoreboardRouter.listen(server, ioRouterOptions);

// Start the server listening
server.listen(port);

describe('A ScoreboardRouter', function () {
    
    var socket
      , mockClient;

    // Before each, open the client socket
    beforeEach(function () {
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
          , gameJSON
          , game;

        // Register the spied function to receive data from the server
        socket.on('game', updateSpy);

        // Wait for client to connect
        waitsFor(connectionState.isConnected, 'client to connect', 1000);

        // Wait for client to get data
        waitsFor(function () { return updateSpy.wasCalled; }, 'socket to emit list', 1000);

        // Build a Game object from the returned data
        runs(function () {
            gameJSON = mockClient.gameJSON;

            expect(gameJSON).not.toBeUndefined();
            expect(gameJSON.state).not.toBeUndefined();
            expect(gameJSON.score).not.toBeUndefined();
            expect(gameJSON.players).not.toBeUndefined();

            expect(function () {
                game = Game(gameJSON);    
            }).not.toThrow();
        });
    });

    // Stop the server listening
    it('closes the server', function () {
        server.close();
    });

});