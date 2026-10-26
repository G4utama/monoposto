// Position bars, shared by driversPosition.js and teamsPosition.js so every series can use them.
//
// The car / rider image is a pixel-art template (assets/templates/<name>.png, see recolor.js)
// recoloured with the entry's borderColor. Choose the template per page:
//     <div id="driversPosition" data-template="car"></div>
// or per entry with a "template" field in the JSON. Default: car.
// Needs dataLoader.js and recolor.js loaded before it.

const POSITION_TEMPLATE_DIR = '../assets/templates/';
const POSITION_DEFAULT_TEMPLATE = 'car';

const createPositionBars = async ({ file, container }) => {
    const entries = await loadJsonData(file);
    const el = document.getElementById(container);
    if (!entries?.length || !el) return;

    const total = (e) => e.points_sum[e.points_sum.length - 1] ?? 0;
    const sorted = [...entries].sort((a, b) => total(b) - total(a));
    const leaderPts = total(sorted[0]);
    const templateOf = (e) => e.template ?? el.dataset.template ?? POSITION_DEFAULT_TEMPLATE;

    el.innerHTML = sorted.map(e => `
        <div style="
                margin-top: ${leaderPts - total(e)}px;
                background: linear-gradient(rgba(${e.borderColor.slice(4, -1)}, 0.25) calc(100% - 101px), transparent calc(100% - 101px))">
            <img data-recolor="${POSITION_TEMPLATE_DIR}${templateOf(e)}.png" data-color="${e.borderColor}" width="64" height="64" alt="">
            <p style="color: ${e.borderColor}">${e.name.slice(0, 3)}</p>
            <p>${total(e)}</p>
        </div>
    `).join('');

    el.style.maxWidth = `${sorted.length * 64}px`;

    await recolorAll(el);
};
