// Include any necessary libraries
var moment = require('moment')

var exports = module.exports = {};

var maximum = 100000;
var minimum = 0;
// Starting point for smoothing
var lastDataUp=0
var lastDataDown=0

// Allow the maximum to be set
exports.setMax = function (setMax) {
	maximum = setMax;
}

// Allow the minimum to be set
exports.setMin = function (setMin) {
	minimum = setMin;
}

// Generate up and down values

exports.portDataPoints = function (smooth = false) {
	randomUp = (Math.floor(Math.random() * (maximum - minimum + 1)) + minimum)
	randomDown = (Math.floor(Math.random() * (maximum - minimum + 1)) + minimum)
	if (smooth) {
		randomUp = Math.floor((randomUp + lastDataUp)/2);
		randomDown = Math.floor((randomDown + lastDataDown)/2);
	}
	dataPoints = {
		labels: moment().toISOString(),
		up: randomUp,
		down: randomDown 
	}
	lastDataUp = randomUp;
	lastDataDown = randomDown;
	return dataPoints;
}