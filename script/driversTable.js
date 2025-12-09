const createDriversTable = async () => {
    try {
        const drivers = await loadJsonData('data/drivers.json');
        const gp = await loadJsonData('data/gp.json');
        if (!drivers || !gp) return;

        // Sort the drivers based on their points_sum values in descending order
        // drivers.sort((a, b) => b.points_sum[b.points_sum.length - 1] - a.points_sum[a.points_sum.length - 1]);
        drivers.sort((a, b) => {
            const aLastPointSum = a.points_sum[a.points_sum.length - 1];
            const bLastPointSum = b.points_sum[b.points_sum.length - 1];
            if (aLastPointSum !== bLastPointSum) {
                return bLastPointSum - aLastPointSum;
            } else {
                return b.sort - a.sort;
            }
        });

        // Create table data
        const tableHtml = `
            <table>
                <tr>
                    <th>Pos</th>
                    <th>Driver</th>
                    ${gp.map(gpData => ` 
                        <th class="flag">
                            <img src="assets/flag/${gpData.name.replace('*', '')}.png">
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
                            driver.points[index] === "25.5" ? driver.borderColor : 
                            driver.points[index] === 0 ? 'rgba(255, 255, 255, 0.25)' : 
                            driver.points[index] === "0.5" ? 'rgba(255, 255, 255, 0.25)' : 
                            driver.points[index] === "DNF" ? 'rgba(255, 0, 0, 0.5)' : 
                            driver.points[index] === "DNS" ? 'rgba(255, 0, 0, 0.5)' : 
                            driver.points[index] === "DSQ" ? 'rgba(255, 0, 0, 0.5)' :
                            driver.points[index] === "DSQ.5" ? 'rgba(255, 0, 0, 0.5)' : 
                            gpData.name.endsWith('*') && driver.points[index] === 8 ? driver.borderColor : 
                            gpData.name.endsWith('*') && driver.points[index] === "8.5" ? driver.borderColor :
                        ''}; 
                        background-color: ${
                            driver.points[index] === 25 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` :
                            driver.points[index] === "25.5" ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` :
                            driver.points[index] === 18 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` :
                            driver.points[index] === "18.5" ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` : 
                            driver.points[index] === 15 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` :
                            driver.points[index] === "15.5" ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` :
                            gpData.name.endsWith('*') && driver.points[index] === 8 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.15)` :
                            gpData.name.endsWith('*') && driver.points[index] === "8.5" ? `rgba(${driver.borderColor.slice(4, -1)}, 0.15)` :
                            gpData.name.endsWith('*') && driver.points[index] === 7 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.15)` :
                            gpData.name.endsWith('*') && driver.points[index] === "7.5" ? `rgba(${driver.borderColor.slice(4, -1)}, 0.15)`:
                            gpData.name.endsWith('*') && driver.points[index] === 6 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.15)`:
                            gpData.name.endsWith('*') && driver.points[index] === "6.5" ? `rgba(${driver.borderColor.slice(4, -1)}, 0.15)`:
                            gpData.name.endsWith('*') ? `rgba(255, 255, 255, 0.05)`:
                        ''}; 
                        text-decoration: ${
                            driver.points[index].toString().endsWith('.5') ? 'underline' :
                        ''};
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
    } catch (error) {
        console.log('An error occurred while fetching data for the drivers table:', error);
    }
};

createDriversTable();
