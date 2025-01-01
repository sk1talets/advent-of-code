const fs = require('fs');

function getRegions(map) {
    const regions = [];
    const visited = {};
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    const checkLocation = (x, y, label, region = []) => {
        if (map[y]?.[x] !== label) {
            // met border
            return 1;
        }

        if (visited[[x, y]]) {
            return 0;
        }

        visited[[x, y]] = true;

        let borders = 0;

        for (const [dx, dy] of directions) {
            borders += checkLocation(x + dx, y + dy, map[y][x], region);
        }

        region.push(borders);

        return 0;
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
            let perimeter = 0;

            for (const borders of region) {
                area++;
                perimeter += borders;
            }

            result += area * perimeter;
        }

        console.log(result);
}

main();