const fs = require('fs');

function hasLoop(map, x, y, dx, dy) {
    const visited = new Set([String([x, y, dx, dy])]);

    while (true) {
        const xx = x + dx;
        const yy = y + dy;

        if (!map[yy]?.[xx]) {
            return false;
        }

        if (['O', '#'].includes(map[yy][xx])) {
            [dx, dy] = [dx ? 0 : -dy, dy ? 0 : dx];

            continue;
        }

        x = xx;
        y = yy;

        const pos = String([x, y, dx, dy]);

        if (visited.has(pos)) {
            return true;
        }

        visited.add(pos)
    }
}

function main() {
    const MAP = fs.readFileSync('./input.txt')
        .toString()
        .split('\n')
        .map((line) => line.split(''));

    let [dx, dy] = [0, -1];
    let [Xi, Yi] = MAP.reduce((pos, line, y) =>
        line.includes('^') ? [line.indexOf('^'), y] : pos
    , []);

    let loops = 0;

    for (let y = 0; y < MAP.length; y++) {
        for (let x = 0; x < MAP[y].length; x++) {
            if (MAP[y][x] === '#') {
                continue;
            }

            if (x === Xi && y === Yi) {
                continue;
            }

            const map = [
                ...MAP.map((line) => [ ...line ]),
            ];

            map[y][x] = 'O';

            loops += hasLoop(map, Xi, Yi, dx, dy);
        }
    }

    console.log(loops);
}

main();