var Observable = require('../../../lib/mixin/observable-mixin.js'),
    _ = require('underscore');

describe('The Observable mixin', function () {

    var Widget,
        widget;

    // Widget example class
    Widget = function () {};

    Widget.prototype.poke = function () {
        this.notify('poke!');
    };

    _.extend(Widget.prototype, Observable);

    beforeEach(function () {
        widget = new Widget();
    });

    it('has a function allow observers to register to be notified', function () {
        var notifyCallback = jasmine.createSpy('"notify() callback"');

        widget.observe(notifyCallback);
        widget.poke();

        expect(notifyCallback).toHaveBeenCalled();
    });

    it('has a function to allow observers to stop observing', function () {
        var notifyCallback
          , context = {};

        notifyCallback = jasmine.createSpy('"notify() callback"');
        widget.observe(notifyCallback);
        widget.observe(notifyCallback, context);

        // Calls callback twice
        widget.poke();
        expect(notifyCallback.callCount).toBe(2);

        // Calls callback only once this time
        widget.stopObserving(notifyCallback);
        widget.poke();
        expect(notifyCallback.callCount).toBe(3);

        // Should not call the callback at all now
        widget.stopObserving(notifyCallback, context);
        widget.poke();
        expect(notifyCallback.callCount).toBe(3);
    });

    it('returns a handler when observing which may be used to stop observing later', function () {
        var notifyCallback
          , context = {}
          , handler
          , contextifiedHandler;

        notifyCallback = jasmine.createSpy('"notify() callback"');
        handler = widget.observe(notifyCallback);
        contextifiedHandler = widget.observe(notifyCallback, context);

        // Calls callback twice
        widget.poke();
        expect(notifyCallback.callCount).toBe(2);

        // Calls callback only once this time
        widget.stopObserving(handler);
        widget.poke();
        expect(notifyCallback.callCount).toBe(3);

        // Should not call the callback at all now
        widget.stopObserving(contextifiedHandler);
        widget.poke();
        expect(notifyCallback.callCount).toBe(3);
    });

    it('allows observers to specify a context for the callback function to be called in', function () {
        var context = {
                foo: 'bar'
            },
            callback = function () {
                this.foo = 'zar';
            };

        widget.observe(callback, context);
        widget.poke();

        expect(context.foo).toBe('zar');
    });

    it('allows allows notification parameters to be sent', function () {
        var response,
            callback = function (param) {
                response = param;
            };

        widget.observe(callback);
        widget.poke();

        expect(response).toBe('poke!');
    });

});