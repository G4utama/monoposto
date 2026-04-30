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
                    <td>
                        <p>${data.drivers[2].slice(0, 3)}</p>
                        <img src="../assets/drivers/teams/${data.drivers[2].slice(4, 7)}.png" alt="driver">
                        <p>${data["drivers-points"][2]}</p>
                        <p>(-${data["drivers-points"][0]-data["drivers-points"][2]})</p>
                    </td>
                    <td>
                        <p>${data.drivers[1].slice(0, 3)}</p>
                        <img src="../assets/drivers/teams/${data.drivers[1].slice(4, 7)}.png" alt="driver">
                        <p>${data["drivers-points"][1]}</p>
                        <p>(-${data["drivers-points"][0]-data["drivers-points"][1]})</p>
                    </td>
                    <td style="background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(${data["driver-color"].slice(4, -1)}, 0.25)">
                        <p>${data.drivers[0].slice(0, 3)}</p>
                        <img src="../assets/drivers/teams/${data.drivers[0].slice(4, 7)}.png" alt="driver">
                        <p >${data["drivers-points"][0]}</p>
                    </td>
                    <td style="background: linear-gradient(to right, rgba(${data["driver-color"].slice(4, -1)}, 0.25), rgba(${data["team-color"].slice(4, -1)}, 0.25)">
                        ${data.number}
                    </td>
                    <td style="background: linear-gradient(to right,  rgba(${data["team-color"].slice(4, -1)}, 0.25), rgba(0, 0, 0, 0)">
                        <p>${data.teams[0]}</p>
                        <img src="../assets/teams/${data.teams[0]}-car.png" alt="team">
                        <p>${data["teams-points"][0]}</p>
                    </td>
                    <td>
                        <p>${data.teams[1]}</p>
                        <img src="../assets/teams/${data.teams[1]}-car.png" alt="team">
                        <p>${data["teams-points"][1]}</p>
                        <p>(-${data["teams-points"][0]-data["teams-points"][1]})</p>
                    </td>
                    <td>
                        <p>${data.teams[2]}</p>
                        <img src="../assets/teams/${data.teams[2]}-car.png" alt="team">
                        <p>${data["teams-points"][2]}</p>
                        <p>(-${data["teams-points"][0]-data["teams-points"][2]})</p>
                    </td>
                </tr>
            `).join('')}
            <tr><td colspan="7">...</td></tr>
        </table>
    `;
    
    document.getElementById('archiveTable').innerHTML = tableHtml;
};

createArchiveTable();
