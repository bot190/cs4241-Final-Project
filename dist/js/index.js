// Using the same dataset configuration for all bandwidth graphs
bandwidthDatasets= [
	{
        label: "Up",
        fill: true,
        lineTension: 0.1,
        backgroundColor: "rgba(63, 149, 255,0.3)",
        borderColor: "rgba(63, 149, 255,1)",
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(63, 149, 255,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(63, 149, 255,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: []
    },
    {
        label: "Down",
        fill: true,
        lineTension: 0.1,
        backgroundColor: "rgba(44, 198, 27,0.3)",
        borderColor: "rgba(44, 198, 27,1)",
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(44, 198, 27,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: []
    }
]

//Using these options for all of the bandwidth graphs so lets save them
var options = {
	scales: {
        xAxes: [{
            type: 'time',
            time: {
            	unit: 'second'
            },
            ticks: {
		    	autoSkip: true,			    	
		    }
        }],
		yAxes: [{
		    type: 'logarithmic',
		    position: 'left',
		    ticks: {
		    	autoSkip: true,			    	
		    }
		}]
    }	
}

var ctx = document.getElementById("myChart");
var charts =[];


charts.push (new Chart(ctx, {
    type: 'line',
    data: {datasets: bandwidthDatasets},
    options
}))

function updateCharts (chart,newdata) {
	chart.data.labels.push(newdata.labels);
	chart.data.datasets[0].data = chart.data.datasets[0].data.concat(newdata.up);
	chart.data.datasets[1].data = chart.data.datasets[1].data.concat(newdata.down);
	// Only show the last 20 data points
	if (chart.data.labels.length >= 30) {
		chart.data.labels.splice(0,1);
		chart.data.datasets[0].data.splice(0,1);
		chart.data.datasets[1].data.splice(0,1);
	}
	chart.update();
}

var socket = io.connect('http://localhost:5000');
socket.on('portData', function (newdata) {
	charts.forEach( function (chart) {
		updateCharts(chart, newdata);
	})
});
