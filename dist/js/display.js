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
	legend: {
		labels: {
			boxWidth: 20,
		}
	},
	scales: {
		xAxes: [{
			type: 'time',
			time: {
				unit: 'second',
				displayFormats: {
					second: 'kk:mm:ss'
				}
			},
			ticks: {
				autoSkip: true,	
				autoSkipPadding: 50,
			}
		}],
		yAxes: [{
			type: 'linear',
			position: 'left',
			ticks: {
				autoSkip: true,
				callback: function (value, index, values) {
					if(value == 0) return '0 Byte';
					var k = 1000; // or 1024 for binary
					var dm = 3;
					var sizes = ['Bytesps', 'KBps', 'MBps', 'GBps', 'TBps', 'PBps', 'EBps', 'ZBps', 'YBps'];
					var i = Math.floor(Math.log(value) / Math.log(k));
					return parseFloat((value / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
				}
			}
		}]
	}	
}

// We need to get a list of ports we can see, and then create charts for them
// Once we've created charts, we should expect data to come in for each port
var bandwidthCharts = document.getElementsByClassName("bandwidthCharts");
var switchCharts = {};
for (var i=0; i< bandwidthCharts.length; i++) {
	var switchName = bandwidthCharts[i].getAttribute("data-switchName");
	if (!switchCharts.hasOwnProperty(switchName)) {
		switchCharts[switchName]=[];
	}
	var port = parseInt(bandwidthCharts[i].getAttribute("data-portName"))-1;
	switchCharts[switchName][port] = new Chart(bandwidthCharts[i], {
	    type: 'line',
		data: {datasets: JSON.parse(JSON.stringify(bandwidthDatasets))},
		options
	});
}

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
	var chart = switchCharts[newdata.switchName][newdata.portName-1];
	updateCharts(chart, newdata);
});
