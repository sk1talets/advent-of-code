const fs = require('fs');

function getAntinodeCount(map, x, y, dx, dy) {
    let count = 0;

    for (let n = 0;; n++) {
        const [X, Y] = [ x + n * dx, y + n * dy ];

        if (!map[Y]?.[X]) {
            return count;
        }

        if (map[Y][X] !== '*') {
            count++;
            map[Y][X] = '*';
        }
    }
}

function main() {
    const map = fs.readFileSync('./input.txt')
        .toString()
        .split('\n')
        .map((line) => line.split(''));

    const symbols = {};

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const symbol = map[y][x];

            if (symbol !== '.' && symbol !== '#') {
                symbols[symbol] ??= [];
                symbols[symbol].push([x, y])
            }
        }
    }

    let nodesCount = 0;

    for (let points of Object.values(symbols)) {
        for (let i = 0; i < points.length; i++) {
            const [xi, yi] = points[i];

            for (let j = i + 1; j < points.length; j++) {
                const [xj, yj] = points[j];
                const [dx, dy] = [xj - xi, yj - yi];

                nodesCount += getAntinodeCount(map, xi, yi, -dx, -dy);
                nodesCount += getAntinodeCount(map, xj, yj, dx, dy);
            }
        }
    }

    console.log(nodesCount);
}

main();