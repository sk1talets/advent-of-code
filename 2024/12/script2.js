const fs = require('fs');

function countSides(borders) {
    const groups = {};

    for (const [x, y, dx, dy] of borders) {
        const key = [dx ? x : y, !!dx, dx || dy];
        const value = dx ? y : x;

        if (key in groups) {
            groups[key].push(value);
        } else {
            groups[key] = [value];
        }
    }

    let sidesCount = 0;

    for (const group of Object.values(groups)) {
        const positions = group.toSorted((a, b) => a - b);

        for (let i = 0; i < positions.length; i++) {
            sidesCount += !i || positions[i] - positions[i - 1] > 1;
        }
    }

    return sidesCount;
}

function getRegions(map) {
    const regions = [];
    const visited = {};
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    const checkLocation = (x, y, label, region) => {
        if (map[y]?.[x] !== label) {
            // met border
            return [x, y];
        }

        if (visited[[x, y]]) {
            return null;
        }

        visited[[x, y]] = true;

        const borders = [];

        for (const [dx, dy] of directions) {
            const borderPos = checkLocation(x + dx, y + dy, map[y][x], region);

            if (borderPos) {
                borders.push([...borderPos, dx, dy]);
            }
        }

        region.push(borders);

        return null;
    }

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (!visited[[x, y]]) {
                const region = [];

                checkLocation(x, y, map[y][x], region);
                regions.push(region);
            }
        }
    }

    return regions;
}

function main() {
    const map = fs.readFileSync('./input.txt')
        .toString()
        .split('\n')
        .map((line) => line.split(''));

        const regions = getRegions(map);

        let result = 0;

        for (const region of regions) {
            let area = 0;

            const regionBorders = [];
            let bordersCount = 0;
            for (const borders of region) {
                area++;
                regionBorders.push(...borders);
                bordersCount += borders.length;
            }

            const sides = countSides(regionBorders);

            result += area * sides;
        }

        console.log(result);
}

main();