#Envision Network
## cs4241-Final-Project
Ben Beauregard

Jacob Link

A Network Usage Visualizer aimed at exploring network usage from switches and routers.

This application is intended to connect to a variety of data sources and provide a visualization of network traffic. 
It focuses on visualizing the traffic on individual ports of network switches as well as the connections between 
switches and routers.

This demo version uses streams of random data to represent the graphs. On a network that you had admin rights to,
you could chart your actual network usage.

Users can log in and logout, and are required to login to access anything beyond the demo page.
Users can add their own switches, with a variable number of ports, and set which ports they would like to see.
Users can then view visualizations of these switch ports on the main page.

## Usage
The main page shows a demo, until a user logs in. There are currently two users available, and no way to add more:

| Username      | Password  | 
| ------------- |---------|
| ben | secret |
| jake | superfancy |

Once logged in, the main page will show all of the switches that a given user has access to. It also opens access to the settings page, where switches can be added, or deleted. Finally each user can enable or disable which ports they see on each switch.

## Technology
This site makes use of a number of different technologies to accomplish each part. It is an [Express](http://expressjs.com/) app running on Node.JS, as this provides a lot of functionality and flexibility in serving http requests. It also takes advantage of a number of middleware providers for various functionality, including POST data parsing, session management, and user login. User login services are provided using [Passport](http://passportjs.org/), which is a node module that can be connected to a large number of different backends. This makes it easy to switch out the authentication method in the app if desired.

The app relies heavily upon [Socket.IO](http://socket.io/) for communication between the server and the client. Web sockets are used to send bandwidth data in realtime. The rooms feature of Socket.IO was used to separate the data provided to each client.

The primary styling of the site is accomplished using [Materialize CSS](http://materializecss.com/). This not only provides a large amount of CSS styling, but also uses JavaScript to create additional effects. 

The HTML for each page was dynamically generated using [Nunjucks](https://mozilla.github.io/nunjucks/) a JavaScript templating language. This made it easy to consolidate similar parts of each page. It also greatly simplifies repetitive HTML that can be found on the graph page as well as the settings page.

The charts themselves were implemented using [Chart.JS](http://www.chartjs.org/), an open source charting library that is highly configurable, lightweight, and creates nice looking graphs.

Additionally some functionality utilizes AJAX requests to update information on the server without causing a page reload.

## Possible Improvements
* Implement a proper user database and authentication
* Add administrator accounts
  * Add new switches, configure data sources
  * Set permissions for other users
  * View all switches and ports
* Add actual backends to collect data from switches and/or databases

There are many other ways that this could be extended to provide additional functionality, or increase usability.

## License

Network Usage Visualizer is available under the [MIT license](http://opensource.org/licenses/MIT).