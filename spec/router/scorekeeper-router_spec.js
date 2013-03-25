var ScorekeeperRouter = require('../../lib/router/scorekeeper-router')
  , GameController = require('../../lib/controller/game-controller')
  , GameState = require('../../lib/model/game-state')
  , Game = require('../../lib/model/game')
  , _ = require('underscore')
  , io = require('socket.io-client')

  , ioClientOptions = {
        'reconnect': false,
        'force new connection': true
    }
  , ioRouterOptions = {
        'close timeout': 0.2,
        'client store expiration': 0.2,
        'log': false
    }

  , scoreboard = GameController.getScoreboard()
  , port = 8888
  , namespace = '/scorekeeper'
  , connectionString = ':' + port + namespace
  , connection;

// State tracker for the connection
connectionState = new function () {
    var connected = false;
    this.connected = function () {
        connected = true;
    };
    this.disconnected = function () {
        connected = false;
    };
    this.isConnected = function () {
        return connected;
    };
};

// Prepare the server and attach the ScorekeeperRouter
server = require('http').createServer();
ScorekeeperRouter.listen(server, ioRouterOptions);

// Start the server listening
server.listen(port);

describe('A ScorekeeperRouter', function () {
    
    var socket
      , mockClient
      , updateSpy
      , errorSpy;

    /* Mock client and functions */
    mockClient = new function () {

        this.handleUpdate = function (data) {
            mockClient.gameJSON = data;
        };

        this.handleError = function (data) {
            mockClient.error = data;
        };

    };

    /* Handlers */
    function abstractReceived (spy) {
        if (spy.wasCalled) {
            spy.reset();
            return true;
        } else {
            return false;
        }
    }

    function gameDataReceived () {
        return abstractReceived(updateSpy);
    }

    function errorReceived () {
        return abstractReceived(errorSpy);
    }

    // Before each, open the client socket
    beforeEach(function () {
        runs(function () {
            // Put everything into a clean initial state
            GameController.newGame();
            connectionState.disconnected();
            mockClient.gameJSON = undefined;
            mockClient.error = undefined;

            // Spy on the mockClient
            updateSpy = spyOn(mockClient, 'handleUpdate').andCallThrough();
            errorSpy = spyOn(mockClient, 'handleError').andCallThrough();

            // Prepare the connection and bindings
            socket = io.connect(connectionString, ioClientOptions);
            socket.on('connect', connectionState.connected);
            socket.on('game', updateSpy);
            socket.on('error', errorSpy);
        });

        // Wait for connection to occur before continuing
        waitsFor(connectionState.isConnected, 'client to connect', 1000);
    });

    // After each test, disconnect the socket
    afterEach(function () {
        if (socket && socket.socket.connected) {
            socket.disconnect();
        }
    });

    it('emits the current game JSON on connection', function () {
        waitsFor(gameDataReceived, 'game data to be received', 1000);

        // Build a Game object from the returned data
        runs(function () {
            expect(mockClient.gameJSON).toEqual(scoreboard.toJSON());
        });
    });

    it('emits the current game JSON on scoreboard update', function () {
        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            GameController.startGame();
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            expect(mockClient.gameJSON).toEqual(scoreboard.toJSON());
            GameController.pointLeft();
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            expect(mockClient.gameJSON).toEqual(scoreboard.toJSON());
        });
    });

    it('emits the current game JSON upon request', function () {
        var game = Game({
                players: ['Dan', 'Carl'],
                score:   [5, 0],
                state:   GameState.IN_PROGRESS
            });

        // Set the game
        GameController.setGame(game);
        expect(scoreboard.toJSON()).toEqual(game.toJSON());

        // Wait for data
        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            mockClient.gameJSON = {};
            socket.emit('request-game');
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            expect(mockClient.gameJSON).toEqual(scoreboard.toJSON());
        });
    });

    it('allows the score keeper to create a new game', function () {
        var newGameJSON = {
                players: ['Jenny', 'Amy'],
                score: [5, 0]
            };

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            socket.emit('command-create', newGameJSON);
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            expect(mockClient.gameJSON).toEqual({
                players: newGameJSON.players,
                score: newGameJSON.score,
                state: GameState.READY
            });
        });
    });

    it('emits an exception error and not a game JSON when the provided new game is bad', function () {
        var badGameJSON = {
                players: ['Jenny']
            };

        waitsFor(gameDataReceived, 'error to be received', 1000);
        runs(function () {
            socket.emit('command-create', badGameJSON);
        });

        waitsFor(errorReceived, 'error to be received', 1000);
        runs(function () {
            // Verify exception
            expect(mockClient.error).not.toBeUndefined();
            expect(mockClient.error.type).toBe('exception');
            expect(typeof mockClient.error.message).toBe('string');

            // Ensure that game JSON wasn't emitted
            expect(updateSpy).not.toHaveBeenCalled();
        });
    });

    it('emits a validation error and not a game JSON when the provided new game is bad', function () {
        var invalidGameJSON = {
                score: [-1, 0]
            }
          , doubleInvalidGameJSON = {
                score: [0, -1],
                players: ['', 'Other player']
            };

        waitsFor(gameDataReceived, 'error to be received', 1000);
        runs(function () {
            socket.emit('command-create', invalidGameJSON);
        });

        waitsFor(errorReceived, 'error to be received', 1000);
        runs(function () {
            // Verify exception
            expect(mockClient.error).not.toBeUndefined();
            expect(mockClient.error.type).toBe('validation');
            expect(_.isArray(mockClient.error.errors)).toBe(true);
            expect(mockClient.error.errors.length).toBe(1);

            // Ensure that game JSON wasn't emitted
            expect(updateSpy).not.toHaveBeenCalled();

            socket.emit('command-create', doubleInvalidGameJSON);
        });

        waitsFor(errorReceived, 'error to be received', 1000);
        runs(function () {
            expect(mockClient.error).not.toBeUndefined();
            expect(mockClient.error.type).toBe('validation');
            expect(_.isArray(mockClient.error.errors)).toBe(true);
            expect(mockClient.error.errors.length).toBe(2);
        });
    });

    it('allows the score keeper to change the game state', function () {
        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            socket.emit('command-state', 'start');
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            expect(mockClient.gameJSON.state).toBe(GameState.IN_PROGRESS);
            socket.emit('command-state', 'end');
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            expect(mockClient.gameJSON.state).toBe(GameState.ENDED);
            GameController.setGame(Game({ state: GameState.IN_PROGRESS }));
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            socket.emit('command-state', 'cancel');
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            expect(mockClient.gameJSON.state).toBe(GameState.CANCELLED);
        });
    });

    it('emits an error in the case of an invalid game state transitions', function () {
        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            socket.emit('command-state', 'end');
        });

        waitsFor(errorReceived, 'error to be received', 1000);
        runs(function () {
            expect(mockClient.error).not.toBeUndefined();

            // Ensure that game JSON wasn't emitted
            expect(updateSpy).not.toHaveBeenCalled();
        });
    });

    it('emits an error when a bad state command is issued', function () {
        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            socket.emit('command-state', 'foo');
        });

        waitsFor(errorReceived, 'error to be received', 1000);
        runs(function () {
            expect(mockClient.error).not.toBeUndefined();

            // Ensure that game JSON wasn't emitted
            expect(updateSpy).not.toHaveBeenCalled();
        });
    });

    it('allows the score keeper to update the score', function () {
        var expectedScore;

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            GameController.startGame();
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            socket.emit('command-point', 'left');
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            expectedScore = [1, 0];
            expect(mockClient.gameJSON.score).toEqual(expectedScore);

            socket.emit('command-point', 'right');
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            expectedScore = [1, 1];
            expect(mockClient.gameJSON.score).toEqual(expectedScore);

            socket.emit('command-point', 'undo');
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            expectedScore = [1, 0];
            expect(mockClient.gameJSON.score).toEqual(expectedScore);

            socket.emit('command-point', 'redo');
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            expectedScore = [1, 1];
            expect(mockClient.gameJSON.score).toEqual(expectedScore);
        });
    });

    it('emits an error when the score keeper attempts to update the score for a game that is not in progress', function () {
        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            socket.emit('command-point', 'left');
        });

        waitsFor(errorReceived, 'error to be received', 1000);
        runs(function () {
            expect(mockClient.error).not.toBeUndefined();

            // Ensure that game JSON wasn't emitted
            expect(updateSpy).not.toHaveBeenCalled();
        });
    });

    it('emits an error when a bad point command is issued', function () {
        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            GameController.startGame();
        });

        waitsFor(gameDataReceived, 'game data to be received', 1000);
        runs(function () {
            socket.emit('command-point', 'foo');
        });

        waitsFor(errorReceived, 'error to be received', 1000);
        runs(function () {
            expect(mockClient.error).not.toBeUndefined();

            // Ensure that game JSON wasn't emitted
            expect(updateSpy).not.toHaveBeenCalled();
        });
    });

    // Stop the server listening
    it('closes the server', function () {
        server.close();
    });

});