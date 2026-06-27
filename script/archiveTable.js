const createArchiveTable = async () => {
    const year = await loadJsonData('data/archive.json');

    const tableHtml = `
        <table>
            <tr>
                <th colspan="3">Drivers</th>
                <th>Year</th>
                <th colspan="3">Teams</th>
            </tr>
            ${year.map(data => `
                ${data.era ? `<tr><td colspan="7">${data.era}</td></tr>` : ''}
                <tr>
                    <td style="background: rgba(${data.driverColor.slice(4, -1)}, 0.25)">
                        <p>${data.driver.slice(4, 7)}</p>
                        <img src="../assets/teams/${data.driver.slice(4, 7)}-car.png">
                    </td>
                    <td style="background: rgba(${data.driverColor.slice(4, -1)}, 0.25)">
                        <img src="../assets/flag/${data.driverFlag}.png">
                    </td>
                    <td style="background: rgba(${data.driverColor.slice(4, -1)}, 0.25)">
                        <p>${data.driver.slice(0, 3)}</p>
                        <img src="../assets/drivers/teams/${data.driver.slice(4, 7)}.png">
                    </td>
                    <td style="background: linear-gradient(to right, rgba(${data.driverColor.slice(4, -1)}, 0.25), rgba(${data.teamColor.slice(4, -1)}, 0.25)">
                        ${data.year}
                    </td>
                    <td style="background: rgba(${data.teamColor.slice(4, -1)}, 0.25)">
                        <p>${data.team}</p>
                        ${data.team ? `<img src="../assets/teams/${data.team}-car.png">` : ''}
                    </td>
                    <td style="background: rgba(${data.teamColor.slice(4, -1)}, 0.25)">
                        ${data.teamFlag ? `<img src="../assets/flag/${data.teamFlag}.png">` : ''}
                    </td>
                    
                </tr>
            `).join('')}
        </table>
    `;
    
    document.getElementById('archiveTable').innerHTML = tableHtml;
};

createArchiveTable();
