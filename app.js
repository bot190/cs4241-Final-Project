//Include Modules
var express = require('express');
var nunjucks = require('nunjucks');
var Server = require('socket.io');
var path = require('path');
var fs   = require('fs')
var portInfo = require('./dist/js/randomData.js');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var Session = require('express-session')
var session = Session({secret: 'envisionetwork', resave: false, saveUninitialized: false})

var app = express()
//Configure express session and passport
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(session);
app.use(passport.initialize());
app.use(passport.session({secret:'envisionetwork', resave: false, saveUninitialized: false}));

//Set a port for local use
var port = 5000
var interval;

//Handle index.html
app.get('/', function (req, res) {
	if (req.user) {
		res.render("display.html", {user: req.user});
	} else {
		res.render("index.html", { user: req.user });
	}
});

app.get('/settings',
		require('connect-ensure-login').ensureLoggedIn(),
		function(req, res){
	res.render('settings.html', { user: req.user });
});

app.get('/login', function (req, res) {
	res.render('login.html', { user: req.user });
});
//Login Route
app.post('/login', 
		passport.authenticate('local', { failureRedirect: '/login' }),
		function(req, res) {
	res.redirect('/');
});


//Serve static files
app.use(express.static('dist'));
http = app.listen(process.env.PORT || port, function () {
	console.log('listening on %d', (process.env.PORT || port));
})

nunjucks.configure('html', {
	autoescape: true,
	express: app
})

var io = new Server();
io.use(function (socket, next) {
	session(socket.handshake, {}, next);
});
io.attach(http);

//We've received a new browser connection
//Need to determine if user is logged in already, if so, join to appropriate
//rooms for each port? If they aren't logged in, then join to demo room.
//Somehow we need to send client available switches/ports. 
io.on('connection', function (socket){
	var session = socket.handshake.session;
	
	if (session.hasOwnProperty('passport')) {
		var user = session.passport.user;
		// Replace user ID with actual user
		user = users[user-1];
		socket.leave('demo');
		for (var monitorSwitch in user.switches) {
			if (user.switches.hasOwnProperty(monitorSwitch)) {
				for (var port=1; port <= user.switches[monitorSwitch].length; port++) {
					// Join a room for each  switch and port
					console.log(monitorSwitch + port);
					socket.join(monitorSwitch + port);
				}
			}
		}
		console.log(user)
	} else {
		socket.join('demo');
	}
	if (interval == null) {
		interval = setInterval(sendData, 10000, socket);
	}
	console.log("Connection");
});

sendData = function(socket) {
	console.log("Sending data");
	// Send demo data
	var datapoint = demo.portUpDown();
	io.to('demo').emit('portData',datapoint);
	// Loop through each port and send new data
	portMonitor.forEach(function (monitor) {
		var datapoint = monitor.portUpDown();
		var room = datapoint.switchName + datapoint.portName;
		io.to(room).emit('portData', datapoint);
	});
}

//Get data sources for every port:
//switches = [ {name: "Switch 1", ports: 8}, {name: "Switch 2", ports: 5 }]
var switches = [];
var portMonitor=[];
fs.readFile("switches.json", function (err, data) {
	if (!err) {
		switches = JSON.parse(data);
		switches.forEach( function (monitorSwitch) {
			for (var port=1; port <= monitorSwitch.ports; port++) {
				portMonitor.push(portInfo.newSource(monitorSwitch.name, port));
			}
		});
	}
});

var demo = portInfo.newSource("Demo Switch", 1);


//LOGIN HANDLING
//Users are stored in a JSON file, with a "switches": {"switchName": [port1, port2, ..., portN], "switchName2": [port1, port2, ..., portN] }
var users = [];
fs.readFile("users.json", function (err, data) {
	if (!err) {
		users = JSON.parse(data);
	}
});

var findById = function(id, cb) {
	var idx = id - 1;
	if (users[idx]) {
		cb(null, users[idx]);
	} else {
		cb(new Error('User ' + id + ' does not exist'));
	}
}

var findByUsername = function(username, cb) {
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
			return cb(null, user);
		}
	}
	return cb(null, null);
}

passport.use(new Strategy(
		function(username, password, cb) {
			findByUsername(username, function(err, user) {
				if (err) { return cb(err); }
				if (!user) { return cb(null, false); }
				if (user.password != password) { return cb(null, false); }
				return cb(null, user);
			});
		}));

//Configure Passport authenticated session persistence.

//In order to restore authentication state across HTTP requests, Passport needs
//to serialize users into and deserialize users out of the session.  The
//typical implementation of this is as simple as supplying the user ID when
//serializing, and querying the user record by ID from the database when
//deserializing.
passport.serializeUser(function(user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
	findById(id, function (err, user) {
		if (err) { return cb(err); }
		cb(null, user);
	});
});
