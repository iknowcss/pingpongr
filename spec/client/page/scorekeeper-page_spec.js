var fs = require('fs')
  , ejs = require('ejs')
  , jsdom = require('jsdom')
  , _ = require('underscore')
  , resource = require('../../resource')

  , $
  , template = resource.ejs('/views/scorekeeper.ejs')
  , modelDefaults = {
      title: 'Scorekeeper'
    }

  , window;

describe('The Scorekeeper Page', function () {

  function loadDOM (model) {

    runs(function () {
      if (_.isFunction(model)) {
        callback = model;
        model = undefined;
      }

      jsdom.env({
        html: ejs.render(template, _.extend({}, modelDefaults, model)),
        src: [resource.jquery()],
        done: function (errors, _window) { 
          window = _window;
          $ = window.$;
        }
      });
    });

    waitsFor('DOM to load', function () {
      return window;
    }, 1000);

  }

  it('has HTML', function () {
    loadDOM();
    runs(function () {
      // console.log($); // Woohoo!
    });
  });

});