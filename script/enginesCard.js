fetch('monoposto/data/engines.json')
.then(response => response.json())
.then(data => {
    // Sort the engines based on their points_sum values in descending order
    let topEngines = data.sort((a, b) => b.points_sum[b.points_sum.length - 1] - a.points_sum[a.points_sum.length - 1]).slice(0, 3);

    // Create the HTML elements for the top engines
    const container = document.querySelector('.engines');
    container.innerHTML = ''; // Clear the container before adding new elements

    // Engine 2
    const engine2 = topEngines[1];
    const engineElement2 = document.createElement('div');
    engineElement2.classList.add('engine', `engine2`, `engine${engine2.name.slice(0, 3)}`);
    engineElement2.innerHTML = `
		<img src="assets/engines/${engine2.name.slice(0, 3)}.png" alt="engine">
		<p style="color: ${engine2.borderColor};">${engine2.name.slice(0, 3)}</p>
		<p>${engine2.points_sum[engine2.points_sum.length - 1]}</p>`;
    container.appendChild(engineElement2);

    // Engine 1
    const engine1 = topEngines[0];
    const engineElement1 = document.createElement('div');
    engineElement1.classList.add('engine', `engine1`, `engine${engine1.name.slice(0, 3)}`);
    engineElement1.innerHTML = `
		<img src="assets/engines/${engine1.name.slice(0, 3)}.png" alt="engine">
		<p style="color: ${engine1.borderColor};">${engine1.name.slice(0, 3)}</p>
		<p>${engine1.points_sum[engine1.points_sum.length - 1]}</p>`;
    container.appendChild(engineElement1);

    // Engine 3
    const engine3 = topEngines[2];
    const engineElement3 = document.createElement('div');
    engineElement3.classList.add('engine', `engine3`, `engine${engine3.name.slice(0, 3)}`);
    engineElement3.innerHTML = `
		<img src="assets/engines/${engine3.name.slice(0, 3)}.png" alt="engine">
		<p	style="color: ${engine3.borderColor};">${engine3.name.slice(0, 3)}</p>
		<p>${engine3.points_sum[engine3.points_sum.length - 1]}</p>`;
    container.appendChild(engineElement3);
})
.catch(error => console.error(error));