fetch('data/drivers.json')
.then(response => response.json())
.then(drivers => {
    fetch('data/gp.json')
    .then(response => response.json())
    .then(gp => {
        // Sort the drivers based on their points_sum values in descending order
        drivers.sort((a, b) => b.points_sum[b.points_sum.length - 1] - a.points_sum[a.points_sum.length - 1]);

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
                <tr>
                    ${drivers.map(driver => `
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
                            gpData.name.endsWith('*') && driver.points[index] === 8 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` :
                            gpData.name.endsWith('*') && driver.points[index] === "8.5" ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` :
                            gpData.name.endsWith('*') && driver.points[index] === 7 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` :
                            gpData.name.endsWith('*') && driver.points[index] === "7.5" ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` :
                            gpData.name.endsWith('*') && driver.points[index] === 6 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` :
                            gpData.name.endsWith('*') && driver.points[index] === "6.5" ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` :
                        ''}; 
                        text-decoration: ${
                            driver.points[index].toString().endsWith('.5') ? 'underline' :
                        ''};
                        text-decoration-color: rgb(255, 0, 255);
                        ">${driver.points[index].toString().replace('.5', '')}</td>`).join('')}
                    <td style="color: ${driver.borderColor};">${driver.points_sum[driver.points_sum.length - 1]}</td>
                </tr>
                `).join('')}
            </table>
        `;
        document.getElementById('driversTable').innerHTML = tableHtml;
    });
});