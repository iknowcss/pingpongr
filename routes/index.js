var game;

function getTables () {
    return [
        { id    : 1
        , room  : 'Clean Room'
        , name  : 'Light blue' }
    ]
}

exports.index = function (req, res) {

    var model;

    model = {
        tables: getTables()
    };

    res.render('index', model);

};