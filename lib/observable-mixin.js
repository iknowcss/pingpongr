var Observable,
    
    _ = require('underscore');

Observable = {

    observe: function (callback, context) {
        ensureObserversList(this);
        if (_.isFunction(callback)) {
            this.observers.push({
                callback: callback,
                context: context
            });
        }
    },

    notify: function () {
        var notifyArgs = arguments;
        ensureObserversList(this);
        _.each(this.observers, function (obsvr) {
            obsvr.callback.apply(obsvr.context, notifyArgs);
        });
    }

};

function ensureObserversList (obj) {
    if (!_.isArray(obj.observers)) {
        obj.observers = [];
    }
}

exports = module.exports = Observable;