// Include Modules
var express = require('express');
var Server = require('socket.io');
var path = require('path');
var rand = require('./dist/js/randomData.js');

var app = express()
var io = new Server();

// Set a port for local use
var port = 5000
var interval;

// Handle Routes
app.get('/', function (req, res) {
  res.sendFile("index.html", {"root": __dirname});
})

// Serve up libraries
app.use(express.static('dist'));

// Get data sources for every port:
// Need to make this an array and put a for loop here for each port.
var port1 = rand.newSource("Switch1", "1/g1");


sendData = function(socket) {
	var datapoints = port1.portUpDown();
	console.log(datapoints);
	io.emit('portData',datapoints);
}

// We've received a new browser connection
io.on('connection', function (socket){
	if (interval == null) {
		interval = setInterval(sendData, 10000, socket);
	}
	console.log("Connection");
});

http = app.listen(process.env.PORT || port, function () {
	console.log('listening on %d', (process.env.PORT || port));
})
io.attach(http);

