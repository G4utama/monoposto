const createTeamsChartData = async (teamNames, gp) => {
    const teams = await loadJsonData('data/teams.json');
    const filteredTeams = teams.filter(team => teamNames.includes(team.name) || teamNames.includes(team.id));
    const chartData = {
        labels: gp.map(gpData => gpData.name_short),
        datasets: filteredTeams.map(team => ({
            label: team.name,
            data: team.points_sum,
            borderColor: team.borderColor,
            borderWidth: 2,
            borderDash: team.borderDash
        }))
    };
    return chartData;
};

const createTeamsChart = async (teamNames, elementId) => {
    const teams = await loadJsonData('data/teams.json');
    const gp = await loadJsonData('data/gp.json');
    if (!teams || !gp) return;

    const chartData = await createTeamsChartData(teamNames, gp);
    const ctx = document.getElementById(elementId).getContext('2d');
    const teamsChart = new Chart(ctx, {
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

createTeamsChart(['MCL','FER', 'RED', 'MER', 'AST', 'ALP', 'HAA', 'RAC', 'WIL', 'SAU'], 'teamsChart');
createTeamsChart(['FER', 'RED', 'MER'], 'teamsChartTop');
createTeamsChart(['AST', 'ALP', 'HAA', 'RAC', 'WIL', 'SAU'], 'teamsChartBottom');
