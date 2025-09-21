fetch('data/drivers.json')
.then(response => response.json())
.then(data => {
	// Sort the drivers based on their points_sum values in descending order
	let topDrivers = data.sort((a, b) => b.points_sum[b.points_sum.length - 1] - a.points_sum[a.points_sum.length - 1]).slice(0, 3);

	// Create the HTML elements for the top drivers
	const container = document.querySelector('.drivers');
	container.innerHTML = ''; // Clear the container before adding new elements

	// Driver 2
	const driver2 = topDrivers[1];
	const driverElement2 = document.createElement('div');
	driverElement2.classList.add('driver', `driver2`, `driver${driver2.name}`);
	driverElement2.innerHTML = `
		<img src="assets/drivers/${driver2.name}.png" alt="driver">
		<p style="color: ${driver2.borderColor};">${driver2.name}</p>
		<p>${driver2.points_sum[driver2.points_sum.length - 1]}</p>`;
	container.appendChild(driverElement2);

	// Driver 1
	const driver1 = topDrivers[0];
	const driverElement1 = document.createElement('div');
	driverElement1.classList.add('driver', `driver1`, `driver${driver1.name}`);
	driverElement1.innerHTML = `
		<img src="assets/drivers/${driver1.name}.png" alt="driver">
		<p style="color: ${driver1.borderColor};">${driver1.name}</p>
		<p>${driver1.points_sum[driver1.points_sum.length - 1]}</p>`;
	container.appendChild(driverElement1);

	// Driver 3
	const driver3 = topDrivers[2];
	const driverElement3 = document.createElement('div');
	driverElement3.classList.add('driver', `driver3`, `driver${driver3.name}`);
	driverElement3.innerHTML = `
		<img src="assets/drivers/${driver3.name}.png" alt="driver">
		<p style="color: ${driver3.borderColor};">${driver3.name}</p>
		<p>${driver3.points_sum[driver3.points_sum.length - 1]}</p>`;
	container.appendChild(driverElement3);

})
.catch(error => console.error(error));
