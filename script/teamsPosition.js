const createDriversPosition = async () => {
    const teams = await loadJsonData('data/teams.json');
    teams.sort((a, b) => b.points_sum[b.points_sum.length - 1] - a.points_sum[a.points_sum.length - 1]);

    const tableHtml = `
        ${teams.map((team, index) => ` 
            <div style="
                    margin-top: ${teams[0].points_sum[teams[0].points_sum.length - 1] - team.points_sum[team.points_sum.length - 1]}px;
                    background: linear-gradient(${`rgba(${team.borderColor.slice(4, -1)}, 0.25)`} calc(100% - 101px), transparent calc(100% - 101px))">
                <img src="../assets/teams/${team.name}-car.png">
                <p style="color: ${team.borderColor}">${team.name.slice(0, 3)}</p>
                <p>${team.points_sum[team.points_sum.length - 1]}</p>
            </div>
        `).join('')}
    `;

    document.getElementById('teamsPosition').innerHTML = tableHtml;

    document.getElementById('teamsPosition').style.maxWidth = `${teams.length * 64}px`;
};

createDriversPosition();
