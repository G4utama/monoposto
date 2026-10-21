// "Next GP" table for the index page: one row per championship.
// Self-contained (own fetch), so it works even if dataLoader.js isn't loaded on the index.
//
// Assumes each championship has  <folder>/data/gp.json  and  <folder>/data/<results>
// ("next GP" = first round after the ones that already have points in the results file).

const NEXT_GP_SPORTS = [
    { label: 'Monoposto',   folder: 'monoposto',  page: 'monoposto/drivers.html' },
    // { label: 'Monoposto_',  folder: 'monoposto_', page: 'monoposto_/monoposto_.html' },
    { label: 'Monoposto E', folder: 'monopostoE', page: 'monopostoE/monopostoE.html' },
    { label: 'Academy',     folder: 'academy',    page: 'academy/academy.html' },
    { label: 'Moto',        folder: 'moto',       page: 'moto/moto.html' },
    { label: 'Endurance',   folder: 'endurance',  page: 'endurance/endurance.html' },
    { label: 'Rallycross',  folder: 'rallycross', page: 'rallycross/rallycross.html' },
    // add { ..., results: 'riders.json' } if a sport doesn't use drivers.json
];

const fetchJsonSafe = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn(`Next GP: could not load ${url} (${error})`);
        return null;
    }
};

const getNextGp = async ({ folder, results = 'drivers.json' }) => {
    const [gp, entries] = await Promise.all([
        fetchJsonSafe(`${folder}/data/gp.json`),
        fetchJsonSafe(`${folder}/data/${results}`),
    ]);
    if (!gp?.length || !entries?.length) return null;

    // Entries already scored = longest points_sum
    const done = Math.max(...entries.map(e => e.points_sum?.length ?? 0));
    const next = gp[done] ?? null;

    // Sprints are separate entries in gp.json ("China*"), so count only the races
    // for "round x/y". A sprint belongs to the race that follows it.
    const isSprintEntry = (g) => g.name.endsWith('*');
    const total = gp.filter(g => !isSprintEntry(g)).length;
    const round = next
        ? gp.slice(0, done + 1).filter(g => !isSprintEntry(g)).length + (isSprintEntry(next) ? 1 : 0)
        : null;

    return { next, round, total };
};

const nextGpRow = (sport, info) => {
    const name = `<a href="${sport.page}">${sport.label}</a>`;

    if (!info) return `<tr><td>${name}</td><td colspan="3">-</td></tr>`;
    if (!info.next) return `<tr><td>${name}</td><td class="seasonComplete" colspan="3">Season complete</td></tr>`;

    const g = info.next;
    const sprint = g.name.endsWith('*');
    const country = g.name.replace('*', '');

    return `
        <tr>
            <td>${name}</td>
            <td>${g.date}</td>
            <td class="flag">
                <img src="assets/flag/${country}.png">
                ${g.name_short.replace('*', '')}${sprint ? ' <small>Sprint</small>' : ''}
            </td>
            <td>${info.round}/${info.total}</td>
        </tr>`;
};

const createNextGpTable = async () => {
    const el = document.getElementById('nextGpTable');
    if (!el) return;

    const infos = await Promise.all(NEXT_GP_SPORTS.map(getNextGp));

    el.innerHTML = `
        <table>
            <tr>
                <th>Series</th>
                <th>Date</th>
                <th>Next GP</th>
                <th>Round</th>
            </tr>
            ${NEXT_GP_SPORTS.map((s, i) => nextGpRow(s, infos[i])).join('')}
        </table>`;
};

createNextGpTable();