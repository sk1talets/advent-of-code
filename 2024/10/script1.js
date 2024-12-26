const fs = require('fs');

const PEAK = 9;

function getPathScore(map, xi, yi, peaks = {}) {
    if (map[yi][xi] === PEAK) {
        const xy = [xi, yi].join();

        return xy in peaks ? 0 : (peaks[xy] = 1);
    }

    const directions = [
        [xi - 1, yi],
        [xi, yi - 1],
        [xi + 1, yi],
        [xi, yi + 1],
    ];

    let score = 0;

    for (const [x, y] of directions) {
        if (map[y]?.[x] !== map[yi][xi] + 1) {
            continue;
        }

        score += getPathScore(map, x, y, peaks);
    }

    return score;
}

function getStartingPoints(map) {
    const points = [];

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 0) {
                points.push([x, y]);
            }
        }
    }

    return points;
}

function main() {
    const map = fs.readFileSync('./input.txt')
        .toString()
        .split('\n')
        .map((line) => line.split('').map(n => parseInt(n, 10)));

    const result = getStartingPoints(map)
        .map(([x, y]) => getPathScore(map, x, y))
        .reduce((sum, cur) => sum + cur, 0);

    console.log(result);
}
main();