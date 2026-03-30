const createDriversTable = async () => {
    const drivers = await loadJsonData('data/drivers.json');
    const gp = await loadJsonData('data/gp.json');
    if (!drivers || !gp) return;

    drivers.sort((a, b) => {
        const aLastPointSum = a.points_sum[a.points_sum.length - 1];
        const bLastPointSum = b.points_sum[b.points_sum.length - 1];
        if (aLastPointSum !== bLastPointSum) {
            return bLastPointSum - aLastPointSum;
        } else {
            return b.sort - a.sort;
        }
    });

    const tableHtml = `
        <table>
            <tr>
                <th>Pos</th>
                <th>D</th>
                ${gp.map(gpData => ` 
                    <th class="flag">
                        <img style="${gpData.name_short.endsWith('*') ? 'width: 50%;' : ''}" src="assets/flag/${gpData.name.replace('*', '')}.png">
                        ${gpData.name_short}
                    </th>
                `).join('')}
                <th>Pts</th>
                <th>Gap</th>
            </tr>
            <tr>
                ${drivers.map((driver, index) => ` 
                <td>${index + 1}</td>
                <td style="color: ${driver.borderColor};">${driver.name}</td>
                ${gp.map((gpData, index) => `<td style=" 
                    color: ${
                        driver.points[index] === 25 ? driver.borderColor : 
                        driver.points[index] === 0 ? 'rgba(255, 255, 255, 0.25)' : 
                        driver.points[index] === "DNF" ? 'rgba(255, 0, 0, 0.5)' : 
                        driver.points[index] === "DNS" ? 'rgba(255, 0, 0, 0.5)' : 
                        driver.points[index] === "DSQ" ? 'rgba(255, 0, 0, 0.5)' :
                        gpData.name.endsWith('*') && driver.points[index] === 8 ? driver.borderColor : 
                        gpData.name.endsWith('*') && driver.points[index] === "8.5" ? driver.borderColor :
                        ''
                    }; 
                    background-color: ${
                        driver.points[index] === 25 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` :
                        driver.points[index] === 18 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` :
                        driver.points[index] === 15 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` :
                        gpData.name.endsWith('*') && driver.points[index] === 8 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.15)` :
                        gpData.name.endsWith('*') && driver.points[index] === 7 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.15)` :
                        gpData.name.endsWith('*') && driver.points[index] === 6 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.15)`:
                        gpData.name.endsWith('*') ? `rgba(255, 255, 255, 0.05)`:
                        ''
                    }; 
                    text-decoration: ${
                        driver.pole[index] === 1 ? 'underline' :
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
};

createDriversTable();
