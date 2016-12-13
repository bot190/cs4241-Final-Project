// Using the same dataset configuration for all bandwidth graphs
bandwidthDatasets= [
	{
        label: "Up",
        fill: true,
        lineTension: 0.1,
        backgroundColor: "rgba(76,180,219,0.4)",
        borderColor: "rgba(76,180,219,1)",
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(76,180,219,1)",
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
        backgroundColor: "rgba(15, 198, 88,0.4)",
        borderColor: "rgba(15, 198, 88,1)",
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(15, 198, 88,1)",
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
	chart.update();
}

var socket = io.connect('http://localhost:5000');
socket.on('portData', function (newdata) {
	charts.forEach( function (chart) {
		updateCharts(chart, newdata);
	})
});
