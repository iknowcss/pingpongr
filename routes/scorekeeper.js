var path = require('path')

  , GameController = require('../lib/controller/game-controller');

exports.index = function (req, res) {

  var tableId = parseInt(req.params[0])
    , data;

  if (tableId !== 1) {
    res.send(404);
  } else {
    data = buildScorekeeperData(GameController);
    res.render('scorekeeper', data);
  }

};

function buildScorekeeperData (gameController) {
  var data = {
    title: gameController.getTableName()
  };

  return data;
}