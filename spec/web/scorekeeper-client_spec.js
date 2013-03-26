var jsdom = require('jsdom').jsdom
  , window
  , $;

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
                '../../web/resource/js/vendor/jquery.js'
            ],
            done: function (errors, _window) {
                window = _window;
                $ = window.$;
                done();
            }
        });
    });

    xit('', function () {

    });
    
});