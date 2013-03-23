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
      , updateSpy;

    function gameDataReceived () {
        if (updateSpy.wasCalled) {
            updateSpy.reset();
            return true;
        } else {
            return false;
        }
    }

    // Before each, open the client socket
    beforeEach(function () {
        runs(function () {
            GameController.newGame();
            connectionState.disconnected();
            socket = io.connect(connectionString, ioClientOptions);
            socket.on('connect', connectionState.connected);
            updateSpy = spyOn(mockClient, 'handleUpdate').andCallThrough();
            socket.on('game', updateSpy);
        });
        waitsFor(connectionState.isConnected, 'client to connect', 1000);
    });

    // After each, disconnect the socket
    afterEach(function () {
        if (socket && socket.socket.connected) {
            socket.disconnect();
        }
    });

    // Mock client and functions
    mockClient = new function () {

        this.handleUpdate = function (data) {
            mockClient.gameJSON = data;
        };

    };

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

    xit('notifies the score keeper of invalid game state transitions', function () {
        // TODO
    });

    // Stop the server listening
    it('closes the server', function () {
        server.close();
    });

});