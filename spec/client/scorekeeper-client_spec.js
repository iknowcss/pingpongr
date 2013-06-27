var ScorekeeperClient = require('../../public/javascripts/scorekeeper-client')
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
    , notifySpy
    , emitSpy = {
      requestGame: jasmine.createSpy(),
      commandCreate: jasmine.createSpy(),
      commandState: jasmine.createSpy(),
      commandPoint: jasmine.createSpy()
    };

  function doConstruct (options) {
    return function () {
      options = _.extend({}, options, {
        port: port,
        ioOptions: clientOptions
      });
      skClient = ScorekeeperClient(options);
      notifySpy = jasmine.createSpy('"game change notify"');
      skClient.observe(notifySpy);
    };
  }

  function handleConnection (socket) {
    socket.on('request-game', emitSpy.requestGame);
    socket.on('command-create', emitSpy.commandCreate);
    socket.on('command-state', emitSpy.commandState);
    socket.on('command-point', emitSpy.commandPoint);
  }

  beforeEach(function () {
    var key;
    for (key in emitSpy) {
      emitSpy[key].reset();
    }
    if (notifySpy) {
      notifySpy.reset();
    }
  });

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
      mockNamespace.emit('game', testGameJSON);
    });
    waitsFor(function () {
      return notifySpy.wasCalled;
    });
    runs(function () {
      expect(notifySpy).toHaveBeenCalledWith('game', testGameJSON);
    });
  });

  it('emits request-game requests to get game info', function () {
    runs(function () {
      skClient.refreshGame();
    });

    waitsFor(function () {
      return emitSpy.requestGame.wasCalled;
    }, 'request-game to be emitted', 1000);

    runs(function () {
      expect(emitSpy.requestGame).toHaveBeenCalled();
    });
  });

  it('emits command-create commands to create games', function () {
    var testGameJSON = {
        players: ['Bob', 'Steve']
      };

    // Verify default createGame call
    runs(function () {
      skClient.createGame();
    });

    waitsFor(function () {
      return emitSpy.commandCreate.wasCalled;
    }, 'command-create to be emitted', 1000);

    runs(function () {
      expect(emitSpy.commandCreate).toHaveBeenCalledWith(jasmine.any(Object));
      emitSpy.commandCreate.reset();
    });

    // Verify createGame call with JSON 
    runs(function () {
      skClient.createGame(testGameJSON);
    });

    waitsFor(function () {
      return emitSpy.commandCreate.wasCalled;
    }, 'command-create to be emitted', 1000);

    runs(function () {
      expect(emitSpy.commandCreate).toHaveBeenCalledWith(testGameJSON);
    });
  });

  it('emits command-state commands to update the state of the game', function () {
    // Verify start game
    runs(function () {
      skClient.startGame();
    });

    waitsFor(function () {
      return emitSpy.commandState.wasCalled;
    }, 'command-state to be emitted', 1000);

    runs(function () {
      expect(emitSpy.commandState).toHaveBeenCalledWith('start');
      emitSpy.commandState.reset();
    });

    // Verify end game
    runs(function () {
      skClient.endGame();
    });

    waitsFor(function () {
      return emitSpy.commandState.wasCalled;
    }, 'command-state to be emitted', 1000);

    runs(function () {
      expect(emitSpy.commandState).toHaveBeenCalledWith('end');
      emitSpy.commandState.reset();
    });

    // Verify cancel game
    runs(function () {
      skClient.cancelGame();
    });

    waitsFor(function () {
      return emitSpy.commandState.wasCalled;
    }, 'command-state to be emitted', 1000);

    runs(function () {
      expect(emitSpy.commandState).toHaveBeenCalledWith('cancel');
      emitSpy.commandState.reset();
    });
  });

  it('emits command-point commands to update the game points', function () {
    // Verify point left
    runs(function () {
      skClient.pointLeft();
    });

    waitsFor(function () {
      return emitSpy.commandPoint.wasCalled;
    }, 'command-point to be emitted', 1000);

    runs(function () {
      expect(emitSpy.commandPoint).toHaveBeenCalledWith('left');
      emitSpy.commandPoint.reset();
    });

    // Verify point right
    runs(function () {
      skClient.pointRight();
    });

    waitsFor(function () {
      return emitSpy.commandPoint.wasCalled;
    }, 'command-point to be emitted', 1000);

    runs(function () {
      expect(emitSpy.commandPoint).toHaveBeenCalledWith('right');
      emitSpy.commandPoint.reset();
    });

    // Verify undo
    runs(function () {
      skClient.undoPoint();
    });

    waitsFor(function () {
      return emitSpy.commandPoint.wasCalled;
    }, 'command-point to be emitted', 1000);

    runs(function () {
      expect(emitSpy.commandPoint).toHaveBeenCalledWith('undo');
      emitSpy.commandPoint.reset();
    });

    // Verify redo
    runs(function () {
      skClient.redoPoint();
    });

    waitsFor(function () {
      return emitSpy.commandPoint.wasCalled;
    }, 'command-point to be emitted', 1000);

    runs(function () {
      expect(emitSpy.commandPoint).toHaveBeenCalledWith('redo');
      emitSpy.commandPoint.reset();
    });
  });

  it('notifies observers of errors when the router emits errors', function () {
    var expectedError = {
        type: 'exception',
        message: 'A general exception occured'
      };

    runs(function () {
      mockNamespace.emit('error', expectedError);
    });
    waitsFor(function () {
      return notifySpy.wasCalled;
    }, 'observers to be notified of an error', 1000);
    runs(function() {
      expect(notifySpy).toHaveBeenCalledWith('error', expectedError);
    });
  });

  it('notifies observers of errors when client not connected and commands are being issued', function () {
    var expectedError = {
        type: 'exception',
        message: 'client is not connected'
      };

    runs(function () {
      skClient.disconnect();
    });
    waitsFor(function () {
      return !skClient.isConnected();
    });
    runs(function () {
      skClient.pointLeft();
      expect(notifySpy).toHaveBeenCalledWith('error', expectedError);
    });
  });

  it('closes the server', function () {
    runs(function () {
      server.close();
    });
    waitsFor(function () {
      return !skClient.isConnected();
    });
  });
  
});