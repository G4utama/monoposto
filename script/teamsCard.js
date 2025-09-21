fetch('data/teams.json')
.then(response => response.json())
.then(data => {
    // Sort the teams based on their points_sum values in descending order
    let topTeams = data.sort((a, b) => b.points_sum[b.points_sum.length - 1] - a.points_sum[a.points_sum.length - 1]).slice(0, 3);

    // Create the HTML elements for the top teams
    const container = document.querySelector('.teams');
    container.innerHTML = ''; // Clear the container before adding new elements

    // Team 2
    const team2 = topTeams[1];
    const teamElement2 = document.createElement('div');
    teamElement2.classList.add('team', `team2`, `team${team2.name}`);
    teamElement2.innerHTML = `
		<img src="assets/teams/${team2.name}-car.png" alt="team">
		<p style="color: ${team2.borderColor};">${team2.name}</p>
		<p>${team2.points_sum[team2.points_sum.length - 1]}</p>`;
    container.appendChild(teamElement2);

    // Team 1
    const team1 = topTeams[0];
    const teamElement1 = document.createElement('div');
    teamElement1.classList.add('team', `team1`, `team${team1.name}`);
    teamElement1.innerHTML = `
		<img src="assets/teams/${team1.name}-car.png" alt="team">
		<p style="color: ${team1.borderColor};">${team1.name}</p>
		<p>${team1.points_sum[team1.points_sum.length - 1]}</p>`;
    container.appendChild(teamElement1);

    // Team 3
    const team3 = topTeams[2];
    const teamElement3 = document.createElement('div');
    teamElement3.classList.add('team', `team3`, `team${team3.name}`);
    teamElement3.innerHTML = `
		<img src="assets/teams/${team3.name}-car.png" alt="team">
		<p	style="color: ${team3.borderColor};">${team3.name}</p>
		<p>${team3.points_sum[team3.points_sum.length - 1]}</p>`;
    container.appendChild(teamElement3);
})
.catch(error => console.error(error));