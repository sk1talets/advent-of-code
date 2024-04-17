const fs = require('fs');

function getIntersection([start1, end1], [start2, end2]) {
    if (start1 >= end2 || end1 <= start2) {
        return null;
    }

    return [
        start1 > start2 ? start1 : start2,
        end1 < end2 ? end1 : end2,
    ]
}

function applyMap(valueRanges, map) {
    const [mapStart, shift, length] = map;
    const ranges = [];
    const updatedRanges = [];

    for (const [start, end] of valueRanges) {
        const intersection = getIntersection([start, end], [mapStart, mapStart + length]);

        if (!intersection) {
            ranges.push([start, end]);
            continue;
        }

        const [intStart, intEnd] = intersection;

        if (start < intStart) {
            ranges.push([start, intStart]);
        }

        updatedRanges.push([intStart + shift, intEnd + shift]);

        if (end > intEnd) {
            ranges.push([intEnd, end]);
        }
    }

    return [ranges, updatedRanges];
}

function applyMaps(valueRanges, maps) {
    const result = [];

    let values = valueRanges;

    for (const map of maps) {
        [values, updatedValues] = applyMap(values, map);
        result.push(...updatedValues);
    }

    result.push(...values);

    return result;
}

function parseInput(file) {
    const lines = fs
        .readFileSync(file)
		.toString()
		.split('\n');

    const mapSets = [];
    const seedRanges = [];

    let curMap = [];

    lines.push('');

    for (const line of lines) {
        if (line.startsWith('seeds:')) {
            const values = line
                .match(/(\d+)/g)
                .map((v) => parseInt(v));

            for (let i = 0; i < values.length; i += 2) {
                seedRanges.push([values[i], values[i] + values[i + 1]]);
            }

            continue;
        }

        const ranges = line.match(/(\d+)/g);

        if (ranges) {
            const [dst, src, length] = line.split(/\s+/).map(v => parseInt(v));

            curMap.push([src, dst - src, length]);
        } else if (curMap.length) {
            mapSets.push(curMap);
            curMap = [];
        }
    }

    return [seedRanges, mapSets];
}

function main() {
    const [seedRanges, mapSets] = parseInput('./input.txt');

    let values = seedRanges;

    for (const maps of mapSets) {
        values = applyMaps(values, maps);
    }

    const result = Math.min(...values.map((range) => range[0]));

    console.log(result);
}

main();