const createDriversChartData = async (driverNames, gp) => {
    const drivers = await loadJsonData('data/drivers.json');
    const filteredDrivers = drivers.filter(driver => driverNames.includes(driver.name) || driverNames.includes(driver.id));
    const chartData = {
        labels: gp.map(gpData => gpData.name_short),
        datasets: filteredDrivers.map(driver => ({
            label: driver.name,
            data: driver.points_sum,
            borderColor: driver.borderColor,
            borderWidth: 2,
            borderDash: driver.borderDash
        }))
    };
    return chartData;
};

const createDriversChart = async (driverNames, elementId) => {
    const drivers = await loadJsonData('data/drivers.json');
    const gp = await loadJsonData('data/gp.json');
    if (!drivers || !gp) return;

    const chartData = await createDriversChartData(driverNames, gp);
    const ctx = document.getElementById(elementId).getContext('2d');
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

createDriversChart(['BAG 63', 'MAR 93', 'ALD 54', 'MAR 73', 'MOR 21', 'DIG 49', 'BIN 33', 'ACO 37', 'BEZ 72', 'MAR 89', 'QUA 20', 'RIN 42', 'FER 25', 'OGU 79', 'MAR 10', 'MIR 36', 'VIN 12', 'BAS 23', 'ZAR 05', 'MOR 11', 'RAZ 07', 'MIL 43'], 'driversChart');