const createDriversChartData = async (driverNames, gp) => {
    const drivers = await loadJsonData('data/drivers.json');
    const filteredDrivers = drivers.filter(driver => driverNames.includes(driver.name) || driverNames.includes(driver.id));

    const maxPoints = Math.max(
        ...filteredDrivers.flatMap(driver => driver.points_sum)
    );

    const chartData = {
        labels: gp.map(gpData => gpData.name_short),
        datasets: filteredDrivers.map(driver => ({
            label: driver.name,
            data: driver.points_sum,
            borderColor: driver.borderColor,
            borderWidth: 2,
            borderDash: driver.borderDash,
            lineTension: 0
        }))
    };

    return { chartData, maxPoints };
};

const createDriversChart = async (driverNames, elementId) => {
    const drivers = await loadJsonData('data/drivers.json');
    const gp = await loadJsonData('data/gp.json');
    if (!drivers || !gp) return;

    const { chartData, maxPoints } = await createDriversChartData(driverNames, gp);

    const pxPerColumn = 64;
    const pxPerPoint = 2;
    const minWidth = 720;
    const maxWidth = 1080;
    const minHeight = 720;
    const canvas = document.getElementById(elementId);
    canvas.width = Math.max(minWidth, chartData.labels.length * pxPerColumn);
    canvas.height = Math.min(maxWidth, (Math.max(minHeight, maxPoints * pxPerPoint)));

    const ctx = canvas.getContext('2d');
    const driversChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: false,
            maintainAspectRatio: false,
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
