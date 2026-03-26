const createTeamsTable = async () => {
    const teams = await loadJsonData('data/teams.json');
    const gp = await loadJsonData('data/gp.json');
    if (!teams || !gp) return;

    teams.sort((a, b) => b.points_sum[b.points_sum.length - 1] - a.points_sum[a.points_sum.length - 1]);

    const tableHtml = `
        <table>
            <tr>
                <th>Pos</th>
                <th>T</th>
                ${gp.map(gpData => ` 
                    <th class="flag">
                        <img style="${gpData.name_short.endsWith('*') ? 'width: 50%;' : ''}" src="assets/flag/${gpData.name.replace('*', '')}.png">
                        ${gpData.name_short}
                    </th>
                `).join('')}
                <th>Tot</th>
                <th>Gap</th>
            </tr>
            <tr>
                ${teams.map((team, index) => `
                <td>${index + 1}</td>
                <td style="color: ${team.borderColor};">${team.name}</td>
                ${gp.map((gpData, index) => `<td style="
                    color: ${
                        team.points[index] === 43 ? team.borderColor : 
                        team.points[index] === "43.podium" ? team.borderColor :
                        team.points[index] === 0 ? 'rgba(255, 255, 255, 0.25)' : 
                        team.points[index] === "DNF" ? 'rgba(255, 0, 0, 0.5)' : 
                        team.points[index] === "DNS" ? 'rgba(255, 0, 0, 0.5)' : 
                        team.points[index] === "DSQ" ? 'rgba(255, 0, 0, 0.5)' : 
                        gpData.name.endsWith('*') && team.points[index] === 15 ? team.borderColor :
                        gpData.name.endsWith('*') && team.points[index] === "15.5" ? team.borderColor :
                        ''
                    };
                    background-color: ${
                        gpData.name.endsWith('*') && team.points[index].toString().endsWith('.podium') ? `rgba(${team.borderColor.slice(4, -1)}, 0.15)` :
                        team.points[index].toString().endsWith('.podium') ? `rgba(${team.borderColor.slice(4, -1)}, 0.25)` :
                        gpData.name.endsWith('*') ? `rgba(255, 255, 255, 0.05)`:
                        ''
                    };
                ">${team.points[index].toString().replace('.podium', '')}</td>`).join('')}
                <td style="color: ${team.borderColor};">${team.points_sum[team.points_sum.length - 1]}</td>
                <td style="color: ${team.borderColor};">
                    ${index > 0
                        ? (teams[index - 1].points_sum[teams[index - 1].points_sum.length - 1] - (team.points_sum[team.points_sum.length - 1] || 0)) !== 0
                            ? '-' + (teams[index - 1].points_sum[teams[index - 1].points_sum.length - 1] - (team.points_sum[team.points_sum.length - 1] || 0))
                            : '='
                        : ''
                    }
                </td>
            </tr>
            `).join('')}
        </table>
    `;

    document.getElementById('teamsTable').innerHTML = tableHtml;
};

createTeamsTable();