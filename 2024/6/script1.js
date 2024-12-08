const fs = require('fs');

function main() {
    const map = fs.readFileSync('./input.txt')
        .toString()
        .split('\n')
        .map((line) => line.split(''));

    let [dx, dy] = [0, -1];
    let [x, y] = map.reduce((pos, line, y) =>
        line.includes('^') ? [line.indexOf('^'), y] : pos
    , []);

    const positions = new Set([`${x}:${y}`]);

    while (true) {
        const xx = x + dx;
        const yy = y + dy;

        if (!map[yy]?.[xx]) {
            break;
        }

        if (map[yy][xx] === '#') {
            [dx, dy] = [dx ? 0 : -dy, dy ? 0 : dx];

            continue;
        }

        x = xx;
        y = yy;

        positions.add(`${x}:${y}`);
    }

    console.log(positions.size);
}

main();