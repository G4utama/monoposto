fetch('data/teams.json')
.then(response => response.json())
.then(teams => {
    fetch('data/gp.json')
    .then(response => response.json())
    .then(gp => {
        // Sort the teams based on their points_sum values in descending order
        teams.sort((a, b) => b.points_sum[b.points_sum.length - 1] - a.points_sum[a.points_sum.length - 1]);

        // Create table data
        const tableHtml = `
            <table>
                <tr>
                    <th></th>
                    ${gp.map(gpData => `
                        <th class="flag"><img src="assets/flag/${gpData.name.replace('*', '')}.png">${gpData.name_short}</th>
                    `).join('')}
                    <th>Tot</th>
                </tr>
                ${teams.map(team => `
                <tr>
                    <td style="color: ${team.borderColor};">${team.name}</td>
                    ${gp.map((gpData, index) => `<td style="
                        color: ${
                            team.points[index] === 43 ? team.borderColor : 
                            team.points[index] === 0 ? 'rgba(255, 255, 255, 0.25)' : 
                            team.points[index] === "DNF" ? 'rgba(255, 0, 0, 0.5)' : 
                            team.points[index] === "DNS" ? 'rgba(255, 0, 0, 0.5)' : 
                            team.points[index] === "DSQ" ? 'rgba(255, 0, 0, 0.5)' : 
                            gpData.name.endsWith('*') && team.points[index] === 15 ? team.borderColor :
                        ''};
                        text-decoration: ${
                            team.points[index].toString().endsWith('.5') ? 'underline' :
                        ''};
                        text-decoration-color: rgb(255, 0, 255);
                        ">${team.points[index].toString().replace('.5', '')}</td>`).join('')}
                    <td style="color: ${team.borderColor};">${team.points_sum[team.points_sum.length - 1]}</td>
                </tr>
                `).join('')}
            </table>
        `;
        document.getElementById('teamsTable').innerHTML = tableHtml;
    });
});