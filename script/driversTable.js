const createDriversTable = async () => {
    const drivers = await loadJsonData('data/drivers.json');
    const gp = await loadJsonData('data/gp.json');
    if (!drivers || !gp) return;

    drivers.sort((a, b) => b.points_sum[b.points_sum.length - 1] - a.points_sum[a.points_sum.length - 1]);

    const tableHtml = `
        <table>
            <tr>
                <th>Pos</th>
                <th>D</th>
                ${gp.map(gpData => ` 
                    <th class="flag">
                        ${gpData.name_short}
                        <img style="${gpData.name_short.endsWith('*') ? 'width: 50%;' : ''}" src="../assets/flag/${gpData.name.replace('*', '')}.png">
                        <small>${gpData.date}</small>
                    </th>
                `).join('')}
                <th>Pts</th>
                <th>Gap</th>
            </tr>
            <tr>
                ${drivers.map((driver, index) => ` 
                <td>${index + 1}</td>
                <td style="color: ${driver.borderColor};">${driver.name} <img style="width: 16px;" src="../assets/flag/${driver.flag}.png"></td>
                ${gp.map((gpData, index) => `<td style=" 
                    color: ${
                        gpData.name.endsWith('*') && driver.win[index] === 1 ? driver.borderColor : 
                        driver.win[index] === 1 ? driver.borderColor : 
                        driver.points[index] === 0 ? 'rgba(255, 255, 255, 0.25)' : 
                        driver.points[index] === "DNF" ? 'rgba(255, 0, 0, 0.5)' : 
                        driver.points[index] === "DNS" ? 'rgba(255, 255, 255, 0.25)' : 
                        driver.points[index] === "DSQ" ? 'rgba(255, 0, 0, 0.5)' :                        ''
                    }; 
                    background-color: ${
                        gpData.name.endsWith('*') && driver.podium[index] === 1 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.15)` :
                        driver.podium[index] === 1 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` :
                        gpData.name.endsWith('*') ? `rgba(255, 255, 255, 0.05)`:
                        ''
                    }; 
                    text-decoration: ${
                        driver.pole[index] === 1 ? 'underline wavy' :
                        ''
                    };
                    font-weight: ${
                        driver.win[index] === 1 ? 'bold' :
                        ''
                    };
                    text-decoration-color: rgb(255, 0, 255);
                ">${driver.points[index].toString().replace('.5', '')}</td>`).join('')}
                <td style="color: ${driver.borderColor};">${driver.points_sum[driver.points_sum.length - 1] || 0}</td>
                <td style="color: ${driver.borderColor};">
                    ${index > 0
                        ? (drivers[index - 1].points_sum[drivers[index - 1].points_sum.length - 1] - (driver.points_sum[driver.points_sum.length - 1] || 0)) !== 0
                            ? '-' + (drivers[index - 1].points_sum[drivers[index - 1].points_sum.length - 1] - (driver.points_sum[driver.points_sum.length - 1] || 0))
                            : '='
                        : ''
                    }
                </td>
            </tr>
            `).join('')}
        </table>
    `;

    document.getElementById('driversTable').innerHTML = tableHtml;

    document.getElementById('driversTable').style.maxWidth = `${(gp.length + 4) * 64}px`;
};

createDriversTable();
