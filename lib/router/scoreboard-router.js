var ScoreboardRouter;

ScoreboardRouter = function (server, options) {
    
    /* Private variables */
    var io
      , namespace;

    /* Constructor */
    function init (server, options) {
        io = require('socket.io').listen(server, options);
        namespace = io
            .of('/scoreboard')
            .on('connection', handleConnection);
    }

    /* Handlers */
    function initBindings (socket) {

    }

    function handleConnection (socket) {
        initBindings(socket);
        emitList();
    }

    /* Emitters */
    function emitList () {
        namespace.emit('list', []);
    }

    // initialize
    init.call(this, server, options);

};

exports = module.exports = {

    listen: function (server, options) {
        return new ScoreboardRouter(server, options);
    }

};