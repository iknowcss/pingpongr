var jsdom = require('jsdom').jsdom
  , resource = require('../resource')
  , window
  , $
  , ScorekeeperClient;

describe('A ScorekeeperClient', function () {

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
                resource.jquery(),
                resource.js('scorekeeper-client.js'),
            ],
            done: function (errors, _window) {
                window = _window;
                $ = window.$;
                ScorekeeperClient = window.ScorekeeperClient;
                done();
            }
        });
    });

    it('constructs a client object with defaults', function () {
        var client = ScorekeeperClient();
        expect(client instanceof ScorekeeperClient).toBe(true);
    });
    
});