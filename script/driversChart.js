const createDriversChartData = (drivers, gp) => {
    const chartData = {
        labels: gp.map(gpData => gpData.name_short),
        datasets: drivers.map(driver => ({
            label: driver.name,
            data: driver.points_sum,
            borderColor: driver.borderColor,
            borderWidth: 2,
            borderDash: driver.borderDash
        }))
    };
    return chartData;
};

const createDriversChart = async () => {
    const drivers = await loadJsonData('data/drivers.json');
    const gp = await loadJsonData('data/gp.json');
    if (!drivers || !gp) return;

    const chartData = createDriversChartData(drivers, gp);
    const ctx = document.getElementById('driversChart').getContext('2d');
    const driversChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            legend: {
                labels: {
                    fontColor: 'rgba(255, 255, 255, 0.75)'
                }
            },
            plugins: {
                datalabels: {
                    display: true,
                    align: 'end',
                    anchor: 'end',
                    font: {
                        // family: 'Courier New',
                        size: 10,
                        style: 'normal',
                        weight: 'normal'
                    },
                    color: 'rgba(255, 255, 255, 0.75)',
                    formatter: (value) => {
                        return value.toString();
                    }
                }
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        color: 'rgba(255, 255, 255, 0.25)'
                    },
                    ticks: {
                        fontColor: 'rgba(255, 255, 255, 0.75)'
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: 'rgba(255, 255, 255, 0.25)'
                    },
                    ticks: {
                        fontColor: 'rgba(255, 255, 255, 0.75)'
                    }
                }]
            }
        }
    });
};

createDriversChart();