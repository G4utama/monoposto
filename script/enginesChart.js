const createEnginesChartData = async (engineNames, gp) => {
    const engines = await loadJsonData('data/engines.json');
    const filteredEngines = engines.filter(engine => engineNames.includes(engine.name) || engineNames.includes(engine.id));
    const chartData = {
        labels: gp.map(gpData => gpData.name_short),
        datasets: filteredEngines.map(engine => ({
            label: engine.name,
            data: engine.points_sum,
            borderColor: engine.borderColor,
            borderWidth: 2,
            borderDash: engine.borderDash,
            lineTension: 0
        }))
    };
    return chartData;
};

const createEnginesChart = async (engineNames, elementId) => {
    const engines = await loadJsonData('data/engines.json');
    const gp = await loadJsonData('data/gp.json');
    if (!engines || !gp) return;

    const chartData = await createEnginesChartData(engineNames, gp);
    const ctx = document.getElementById(elementId).getContext('2d');
    const enginesChart = new Chart(ctx, {
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
