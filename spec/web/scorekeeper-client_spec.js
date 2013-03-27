var jsdom = require('jsdom').jsdom
  , resource = require('../resource')
  , window
  , io
  , ScorekeeperClient;

describe('A ScorekeeperClient', function () {

    var globalClient;

    function doConstruct (options) {
        return function () {
            globalClient = ScorekeeperClient(options);
        };
    }

    beforeEach(function (done) {
        // If the DOM is already loaded, don't load it again
        if (window) {
            done();
            return;
        }

        // Load the DOM
        jsdom.env({
            html: '<html><head></head><body></body></html>',
            scripts: [
                resource.io(),
                resource.js('scorekeeper-client.js'),
            ],
            done: function (errors, _window) {
                window = _window;
                io = window.io;
                ScorekeeperClient = window.ScorekeeperClient;
                done();
            }
        });
    });

    it('constructs a client object with defaults that connects', function () {
        expect(doConstruct()).not.toThrow();
        expect(globalClient instanceof ScorekeeperClient).toBe(true);

        globalClient.connect();
    });
    
});