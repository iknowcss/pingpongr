var ScoreboardRouter = require('../../lib/router/scoreboard-router')
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

        this.handleList = function (data) {
            mockClient.list = data;
        };

    };

    it('emits a list of available scoreboards upon connection', function () {
        var listSpy = spyOn(mockClient, 'handleList').andCallThrough();

        socket.on('list', listSpy);

        waitsFor(connectionState.isConnected, 'client to connect');
        waitsFor(function () {
            return listSpy.wasCalled;
        }, 'socket to emit list');

        runs(function () {
            expect(mockClient.list instanceof Array).toBe(true);
        });
    });

    // Stop the server listening
    it('closes the server', function () {
        server.close();
    });

});