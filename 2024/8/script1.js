const fs = require('fs');

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
                const antinodes = [
                    [xi - dx, yi - dy],
                    [xj + dx, yj + dy],
                ];

                for (const [x, y] of antinodes) {
                    if (map[y]?.[x] && map[y][x] !== '+') {
                        map[y][x] = '+';
                        nodesCount++;
                    }
                }
            }
        }
    }

    console.log(nodesCount);
}

main();