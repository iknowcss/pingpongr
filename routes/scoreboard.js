exports.index = function (req, res) {
	var data = {
		title: 'Scoreboard'
	};
    res.render('scoreboard', data);
};