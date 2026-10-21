const createDriversTable = async () => {
    const drivers = await loadJsonData('data/drivers.json');
    const gp = await loadJsonData('data/gp.json');
    if (!drivers || !gp) return;

    const sumAt = (d, i) => d.points_sum[i] ?? 0;
    const lastIdx = Math.max(...drivers.map(d => d.points_sum.length)) - 1;

    // Stat columns. Sprints are separate entries in gp.json ("China*"): the big number counts
    // races only, and the sprint count goes in a <small> next to it (hidden when it is 0).
    const isSprint = (i) => gp[i]?.name.endsWith('*');
    const stat = (arr, test, label) => {
        const race = arr.filter((v, i) => test(v) && !isSprint(i)).length;
        const sprint = arr.filter((v, i) => test(v) && isSprint(i)).length;
        const dim = race + sprint === 0 ? 'rgba(255, 255, 255, 0.25)' : '';
        const small = sprint ? `<small>+${sprint}</small>` : '';
        const title = sprint ? ` title="${race} ${label} in races, ${sprint} in sprints"` : '';
        return `<td style="color: ${dim};"${title}>${race}${small}</td>`;
    };

    // Standings after the previous round (computed on a copy, before the main sort)
    const prevRank = {};
    if (lastIdx > 0) {
        [...drivers]
            .sort((a, b) => sumAt(b, lastIdx - 1) - sumAt(a, lastIdx - 1))
            .forEach((d, i) => (prevRank[d.name] = i + 1));
    }

    // Current standings
    drivers.sort((a, b) => sumAt(b, lastIdx) - sumAt(a, lastIdx));

    // Pos change
    const posArrow = (driver, index) => {
        const prev = prevRank[driver.name];
        if (!prev) return '';
        const now = index + 1;
        if (now < prev) return `<span class="pos-up">▲</span>`;
        if (now > prev) return `<span class="pos-down">▼</span>`;
        return '';
    };

    // Points still available in the rounds
    const maxPerWeekend = (gpData, type = 'driver') => gpData[`max_${type}`] ?? 0;
    const remainingPts = gp
        .slice(lastIdx + 1)
        .reduce((sum, g) => sum + maxPerWeekend(g, 'driver'), 0);

    const leaderPts = sumAt(drivers[0], lastIdx);
    const secondPts = sumAt(drivers[1], lastIdx);

    const titleStatus = (driver, index) => {
        const pts = sumAt(driver, lastIdx);
        if (index === 0 && pts > secondPts + remainingPts) return 'champion'; // clinched
        if (pts + remainingPts < leaderPts) return 'out';                     // mathematically eliminated
        return 'alive';
    };

    const tableHtml = `
        <table>
            <tr>
                <th>Pos</th>
                <th>D</th>
                ${gp.map(gpData => ` 
                    <th class="flag">
                        ${gpData.name_short}
                        <img style="${gpData.name_short.endsWith('*') ? 'width: 50%;' : ''}" src="../assets/flag/${gpData.name.replace('*', '')}.png">
                        <small>${gpData.date}</small>
                    </th>
                `).join('')}
                <th>Win</th>
                <th>Pole</th>
                <th>Pod</th>
                <th>DNF</th>
                <th>Pts</th>
                <th>Gap</th>
            </tr>
            <tr>
                ${drivers.map((driver, index) => ` 
                ${(() => {
                    const status = titleStatus(driver, index);
                    return `<td style="
                    background-color: ${
                        status === 'champion' ? `rgba(127, 127, 0, 1)` :
                        status === 'alive' ? `rgba(0, 63, 0, 1)` :
                        status === 'out' ? `rgba(63, 0, 0, 1)` :
                        ''
                    };
                    " title="Max possible: ${sumAt(driver, lastIdx) + remainingPts}">
                        ${index + 1}${posArrow(driver, index)}
                    </td>`;
                })()}
                <td class="flagMini" style="color: ${driver.borderColor};">${driver.name.slice(0,3)}<sub>${driver.name.slice(4,7)}</sub> <img style="width: 16px;" src="../assets/flag/${driver.flag}.png"></td>
                ${gp.map((gpData, index) => `<td style=" 
                    color: ${
                        gpData.name.endsWith('*') && driver.win[index] === 1 ? driver.borderColor : 
                        driver.win[index] === 1 ? driver.borderColor : 
                        driver.points[index] === 0 ? 'rgba(255, 255, 255, 0.25)' : 
                        driver.points[index] === "DNF" ? 'rgba(255, 0, 0, 0.5)' : 
                        driver.points[index] === "DNS" ? 'rgba(255, 255, 255, 0.25)' : 
                        driver.points[index] === "DSQ" ? 'rgba(255, 255, 255, 0.25)' :                        ''
                    }; 
                    background-color: ${
                        gpData.name.endsWith('*') && driver.podium[index] === 1 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.15)` :
                        driver.podium[index] === 1 ? `rgba(${driver.borderColor.slice(4, -1)}, 0.25)` :
                        gpData.name.endsWith('*') ? `rgba(255, 255, 255, 0.05)`:
                        ''
                    }; 
                    text-decoration: ${
                        driver.pole[index] === 1 ? 'underline' :
                        ''
                    };
                    font-weight: ${
                        driver.win[index] === 1 ? 'bold' :
                        ''
                    };
                    text-decoration-color: rgb(255, 0, 255);
                ">${driver.points[index].toString().replace('.5', '')}</td>`).join('')}
                ${stat(driver.win, v => v === 1, 'wins')}
                ${stat(driver.pole, v => v === 1, 'poles')}
                ${stat(driver.podium, v => v === 1, 'podiums')}
                ${stat(driver.points, v => v === 'DNF', 'DNFs')}
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

    document.getElementById('driversTable').style.maxWidth = `${(gp.length + 8) * 64}px`;
    document.getElementById('driversTable').classList.add('stats-4'); // 4 stat columns (Win, Pole, Pod, DNF) before Pts / Gap
};

createDriversTable();