const createEnginesTable = async () => {
    const engines = await loadJsonData('data/engines.json');
    const gp = await loadJsonData('data/gp.json');
    if (!engines || !gp) return;

    engines.sort((a, b) => b.points_sum[b.points_sum.length - 1] - a.points_sum[a.points_sum.length - 1]);

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
            ${engines.map((engine, index) => `
                <td>${index + 1}</td>
                <td style="color: ${engine.borderColor};">${engine.name} <img style="width: 16px;" src="../assets/flag/${engine.flag}.png"></td>
                ${gp.map((gpData, index) => `<td style="
                    color: ${
                        engine.podiumSweep[index] === 1 ? engine.borderColor : 
                        engine.points[index] === 0 ? 'rgba(255, 255, 255, 0.25)' : 
                        engine.points[index] === "DNF" ? 'rgba(255, 0, 0, 0.5)' : 
                        engine.points[index] === "DNS" ? 'rgba(255, 255, 255, 0.25)' : 
                        engine.points[index] === "DSQ" ? 'rgba(255, 0, 0, 0.5)' :
                        gpData.name.endsWith('*') && engine.podiumSweep[index] === 1 ? engine.borderColor :
                        ''
                    };
                    background-color: ${
                        gpData.name.endsWith('*') && engine.points[index].toString().endsWith('.podium') ? `rgba(${engine.borderColor.slice(4, -1)}, 0.15)` :
                        engine.podium[index] === 1 ? `rgba(${engine.borderColor.slice(4, -1)}, 0.25)` :
                        gpData.name.endsWith('*') ? `rgba(255, 255, 255, 0.05)`:
                        ''
                    };
                    font-weight: ${
                        engine.podiumSweep[index] === 1 ? 'bold' :
                        ''
                    };
                ">${engine.points[index]}</td>`).join('')}
                <td style="color: ${engine.borderColor};">${engine.points_sum[engine.points_sum.length - 1]}</td>
                <td style="color: ${engine.borderColor};">
                    ${index > 0
                        ? (engines[index - 1].points_sum[engines[index - 1].points_sum.length - 1] - (engine.points_sum[engine.points_sum.length - 1] || 0)) !== 0
                            ? '-' + (engines[index - 1].points_sum[engines[index - 1].points_sum.length - 1] - (engine.points_sum[engine.points_sum.length - 1] || 0))
                            : '='
                        : ''
                    }
                </td>
            </tr>
            `).join('')}
        </table>
    `;

    document.getElementById('enginesTable').innerHTML = tableHtml;
};

createEnginesTable();