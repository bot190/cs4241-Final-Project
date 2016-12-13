// Include any necessary libraries
var moment = require('moment')

var exports = module.exports = {};

// Other sources should follow the same style
// Given a switch name and a Port Name
// Return an object that can be used to get new information about the port

exports.newSource = function (switchName, portName) {
	var dataSource = Object();
	
	// Store 
	dataSource.switchName = switchName;
	dataSource.portName = portName;
	
	dataSource.maximum = 100000;
	dataSource.minimum = 0;
	dataSource.lastDataUp = 0;
	dataSource.lastDataDown = 0;
	
	// Setters
	dataSource.setMax = function (setMax) {
		dataSource.maximum = setMax;
	}
	
	dataSource.setMin = function (setMin) {
		dataSource.minimum = setMin;
	}
	
	
	dataSource.portUpDown = function () {
		randomUp = (Math.floor(Math.random() * (dataSource.maximum - dataSource.minimum + 1)) + dataSource.minimum)
		randomDown = (Math.floor(Math.random() * (dataSource.maximum - dataSource.minimum + 1)) + dataSource.minimum)
		randomUp = Math.floor((randomUp + dataSource.lastDataUp)/2);
		randomDown = Math.floor((randomDown + dataSource.lastDataDown)/2);
		dataPoints = {
			labels: moment().toISOString(),
			up: randomUp,
			down: randomDown 
		}
		dataSource.lastDataUp = randomUp;
		dataSource.lastDataDown = randomDown;
		return dataPoints;
	}
	
	// Return port data object
	return dataSource;
}
