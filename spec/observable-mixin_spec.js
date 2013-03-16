var Observable = require('../lib/observable-mixin.js'),
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