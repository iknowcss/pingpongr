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

// State tracker of the connection
connectionState = new (function () {
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
})();

// Prepare the server and attach the ScoreboardRouter
server = require('http').createServer();
ScoreboardRouter.listen(server, ioRouterOptions);

// Start the server listening
server.listen(port);

describe('A ScoreboardRouter', function () {
    
    var socket;

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

    it('emits a list of available scoreboards upon connection', function () {
        var listSpy = jasmine.createSpy()
          , emittedList;

        socket.on('list', listSpy);

        waitsFor(connectionState.isConnected, 'client to connect');
        waitsFor(function () {
            return listSpy.wasCalled;
        }, 'socket to emit list');

        runs(function () {
            emittedList = listSpy.calls[0].args[0];
            expect(emittedList instanceof Array).toBe(true);
        });
    });

    // Stop the server listening
    it('closes the server', function () {
        server.close();
    });

});