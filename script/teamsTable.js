const createTeamsTable = async () => {
    const teams = await loadJsonData('data/teams.json');
    const gp = await loadJsonData('data/gp.json');
    if (!teams || !gp) return;

    const sumAt = (d, i) => d.points_sum[i] ?? 0;
    const lastIdx = Math.max(...teams.map(d => d.points_sum.length)) - 1;

    // Standings after the previous round (computed on a copy, before the main sort)
    const prevRank = {};
    if (lastIdx > 0) {
        [...teams]
            .sort((a, b) => sumAt(b, lastIdx - 1) - sumAt(a, lastIdx - 1))
            .forEach((d, i) => (prevRank[d.name] = i + 1));
    }

    // Current standings
    teams.sort((a, b) => sumAt(b, lastIdx) - sumAt(a, lastIdx));

    // Pos change
    const posArrow = (team, index) => {
        const prev = prevRank[team.name];
        if (!prev) return '';
        const now = index + 1;
        if (now < prev) return `<span class="pos-up">▲</span>`;
        if (now > prev) return `<span class="pos-down">▼</span>`;
        return '';
    };

    // Points still available in the rounds
    const maxPerWeekend = (gpData, type = 'team') => gpData[`max_${type}`] ?? 0;
    const remainingPts = gp
        .slice(lastIdx + 1)
        .reduce((sum, g) => sum + maxPerWeekend(g, 'team'), 0);

    const leaderPts = sumAt(teams[0], lastIdx);
    const secondPts = sumAt(teams[1], lastIdx);

    const titleStatus = (team, index) => {
        const pts = sumAt(team, lastIdx);
        if (index === 0 && pts > secondPts + remainingPts) return 'champion'; // clinched
        if (pts + remainingPts < leaderPts) return 'out';                     // mathematically eliminated
        return 'alive';
    };

    const tableHtml = `
        <table>
            <tr>
                <th>Pos</th>
                <th>T</th>
                ${gp.map(gpData => ` 
                    <th class="flag">
                        ${gpData.name_short}
                        <img style="${gpData.name_short.endsWith('*') ? 'width: 50%;' : ''}" src="../assets/flag/${gpData.name.replace('*', '')}.png">
                        <small>${gpData.date}</small>
                    </th>
                `).join('')}
                <th>Tot</th>
                <th>Gap</th>
            </tr>
            <tr>
                ${teams.map((team, index) => `
                ${(() => {
                    const status = titleStatus(team, index);
                    return `<td class="title-${status}" title="Max possible: ${sumAt(team, lastIdx) + remainingPts}">
                        ${index + 1}${posArrow(team, index)}
                    </td>`;
                })()}
                <td style="color: ${team.borderColor};">${team.name} <img style="width: 16px;" src="../assets/flag/${team.flag}.png"></td>
                ${gp.map((gpData, index) => `<td style="
                    color: ${
                        team.firstSecond[index] === 1 ? team.borderColor : 
                        team.points[index] === 0 ? 'rgba(255, 255, 255, 0.25)' : 
                        team.points[index] === "DNF" ? 'rgba(255, 0, 0, 0.5)' : 
                        team.points[index] === "DNS" ? 'rgba(255, 255, 255, 0.25)' : 
                        team.points[index] === "DSQ" ? 'rgba(255, 255, 255, 0.25)' : 
                        gpData.name.endsWith('*') && team.firstSecond[index] === 1 ? team.borderColor :
                        ''
                    };
                    background-color: ${
                        gpData.name.endsWith('*') && team.points[index].toString().endsWith('.podium') ? `rgba(${team.borderColor.slice(4, -1)}, 0.15)` :
                        team.podium[index] === 1 ? `rgba(${team.borderColor.slice(4, -1)}, 0.25)` :
                        gpData.name.endsWith('*') ? `rgba(255, 255, 255, 0.05)`:
                        ''
                    };
                    font-weight: ${
                        team.firstSecond[index] === 1 ? 'bold' :
                        ''
                    };
                ">${team.points[index]}</td>`).join('')}
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

    document.getElementById('teamsTable').style.maxWidth = `${(gp.length + 4) * 64}px`;
};

createTeamsTable();