var ScoreboardSocket;

ScoreboardSocket = function (initScoreboard) {
    
    /* Private variables */
    var scoreboard;

    /* Constructor */
    function init(initScoreboard) {
        
    }

    // initialize
    init.call(this, initScoreboard);

};

exports = module.exports = function (initScoreboard) {
    return new ScoreboardSocket(initScoreboard);
};

exports.prototype = ScoreboardSocket.prototype = {
    constructor: ScoreboardSocket
};