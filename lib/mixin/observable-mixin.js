(function () {

  var root = this

    , Observable
    , Handler

    , _

    , isNode = (typeof exports !== 'undefined');

  Handler = function (callback, context) {
    this.callback = callback;
    this.context = context;
  };

  Handler.prototype.equals = function (that) {
    return this.callback === that.callback &&
        this.context === that.context;
  };

  Observable = {

    observe: function (callback, context) {
      var handler;
      ensureObserversList(this);
      if (_.isFunction(callback)) {
        handler = new Handler(callback, context);
        this.observers.push(handler);
        return handler;
      }
    },

    stopObserving: function (callback, context) {
      var handler
        , removeHandler;

      if (callback instanceof Handler) {
        removeHandler = callback;
      } else {
        removeHandler = new Handler(callback, context);
      }

      for (var i = 0; i < this.observers.length; i++) {
        handler = this.observers[i];
        if (handler.equals(removeHandler)) {
          this.observers.splice(i, 1);
          i--;
        }
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

  // Get references to the necessary modules if in Node
  if (isNode) {
    _ = require('underscore');
  } else {
    _ = root._;
  }

  // Export the module to node or to window depending on the context
  if (isNode) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Observable;
    }
    exports.Observable = Observable;
  } else {
    root.Observable = Observable;
  }

}).call(this);