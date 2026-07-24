const createTeamsChartData = async (teamNames, gp) => {
    const teams = await loadJsonData('data/teams.json');
    const filteredTeams = teams.filter(team => teamNames.includes(team.name) || teamNames.includes(team.id));
    
    const maxPoints = Math.max(
        ...filteredTeams.flatMap(team => team.points_sum)
    );

    const chartData = {
        labels: gp.map(gpData => gpData.name_short),
        datasets: filteredTeams.map(team => ({
            label: team.name,
            data: team.points_sum,
            borderColor: team.borderColor,
            borderWidth: 2,
            borderDash: team.borderDash,
            lineTension: 0
        }))
    };
    
    return { chartData, maxPoints };
};

const createTeamsChart = async (teamNames, elementId) => {
    const teams = await loadJsonData('data/teams.json');
    const gp = await loadJsonData('data/gp.json');
    if (!teams || !gp) return;

    const { chartData, maxPoints } = await createTeamsChartData(teamNames, gp);

    const pxPerColumn = 64;
    const pxPerPoint = 2;
    const minWidth = 720;
    const maxWidth = 1080;
    const minHeight = 720;
    const canvas = document.getElementById(elementId);
    canvas.width = Math.max(minWidth, chartData.labels.length * pxPerColumn);
    canvas.height = Math.min(maxWidth, (Math.max(minHeight, maxPoints * pxPerPoint)));

    const ctx = canvas.getContext('2d');
    const teamsChart = new Chart(ctx, {
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
