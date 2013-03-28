var jsdom = require('jsdom').jsdom
  , resource = require('../resource')
  , _ = require('underscore')

  , server
  , port = 8888
  , mockRouter
  , routerOptions = {
        'close timeout': 0.2,
        'client store expiration': 0.2,
        'log': false
    }

  , window
  , ScorekeeperClient
  , clientOptions = {
        'reconnect': false,
        'force new connection': true
    };

describe('A ScorekeeperClient', function () {

    var globalClient;

    function doConstruct (options) {
        return function () {
            options = _.extend({}, options, {
                port: port,
                ioOptions: clientOptions
            });
            globalClient = ScorekeeperClient(options);
        };
    }

    beforeEach(function () {
        var envOptions;

        if (!window) { 
            envOptions = {
                html: '<html><head></head><body></body></html>',
                scripts: [
                    resource.io(),
                    resource.underscore(),
                    resource.js('scorekeeper-client.js'),
                ],
                done: function (errors, _window) {
                    window = _window;
                    window.console = console
                    ScorekeeperClient = window.ScorekeeperClient;
                }
            };

            runs(function () {
                jsdom.env(envOptions);
            });
            waitsFor(function () {
                return !!window;
            });
        }
    });

    it('opens the server', function () {
        // Prepare the server and attach the mockRouter
        server = require('http').createServer();
        mockRouter = require('socket.io').listen(server, routerOptions);

        // Start the server listening
        server.listen(port);
    });

    it('constructs a client object that connects', function () {
        runs(function () {
            expect(doConstruct()).not.toThrow();
            expect(globalClient instanceof ScorekeeperClient).toBe(true);

            globalClient.connect();
        });
        waitsFor(function () {
            return globalClient.connected;
        });
    });

    it('closes the server', function () {
        runs(function () {
            // Connect the client to null to disconnect it from the server
            //io.connect(null, {'force new connection': true});
            server.close();
        });
        waitsFor(function () {
            return true;
            //return !socket.socket.connected;
        });
    });
    
});