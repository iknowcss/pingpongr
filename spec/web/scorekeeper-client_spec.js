var ScorekeeperClient = require('../../web/resource/js/scorekeeper-client')
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
  , namespace = '/scorekeeper'
  , mockRouter
  , mockNamespace;

describe('A ScorekeeperClient', function () {

    var skClient
      , updateSpy;

    function doConstruct (options) {
        return function () {
            options = _.extend({}, options, {
                port: port,
                namespace: namespace,
                ioOptions: clientOptions
            });
            skClient = ScorekeeperClient(options);
            updateSpy = jasmine.createSpy();
            skClient.observe(updateSpy);
        };
    }

    function handleConnection (socket) {
        socket.on('request-game', handleEmit);
        socket.on('command-create', handleEmit);
        socket.on('command-state', handleEmit);
        socket.on('command-point', handleEmit);
    }

    function handleEmit (data) {
        console.log(data);
    }

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
            expect(skClient instanceof ScorekeeperClient).toBe(true);

            skClient.connect();
        });
        waitsFor(function () {
            return skClient.isConnected();
        });
    });

    it('receives gameJSONs and notifies observers', function () {
        var testGameJSON = Game().toJSON();
        runs(function () {
            updateSpy.reset();
            mockNamespace.emit('game', testGameJSON);
        });
        waitsFor(function () {
            return updateSpy.wasCalled;
        });
        runs(function () {
            expect(updateSpy).toHaveBeenCalledWith(testGameJSON);
        });
    });

    it('closes the server', function () {
        runs(function () {
            // Connect the client to null to disconnect it from the server
            skClient.disconnect();
            server.close();
        });
        waitsFor(function () {
            return !skClient.isConnected();
        });
    });
    
});