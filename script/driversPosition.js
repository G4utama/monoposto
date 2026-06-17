const createDriversPosition = async () => {
    const drivers = await loadJsonData('data/drivers.json');
    drivers.sort((a, b) => b.points_sum[b.points_sum.length - 1] - a.points_sum[a.points_sum.length - 1]);

    const tableHtml = `
        ${drivers.map((driver, index) => ` 
            <div style="
                    margin-top: ${drivers[0].points_sum[drivers[0].points_sum.length - 1] - driver.points_sum[driver.points_sum.length - 1]}px;
                    background: linear-gradient(${`rgba(${driver.borderColor.slice(4, -1)}, 0.25)`} calc(100% - 101px), transparent calc(100% - 101px))">
                <img src="../assets/teams/${driver.team}-car.png">
                <p style="color: ${driver.borderColor}">${driver.name.slice(0, 3)}</p>
                <p>${driver.points_sum[driver.points_sum.length - 1]}</p>
            </div>
        `).join('')}
    `;

    document.getElementById('driversPosition').innerHTML = tableHtml;

    document.getElementById('driversPosition').style.maxWidth = `${drivers.length * 64}px`;
};

createDriversPosition();
