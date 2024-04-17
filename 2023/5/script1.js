const fs = require('fs');

function getMapValue(range, value) {
    const [dstRangeStart, srcRangeStart, length] = range;
    const offset = value - srcRangeStart;

    if (offset >= 0 && offset <= length) {
        return dstRangeStart + offset;
    }

    return null;
}

function convertValue(ranges, value) {
    for (const range of ranges) {
        const newValue = getMapValue(range, value);

        if (newValue !== null) {
            return newValue;
        }
    }

    return value;
}

function convertValues(maps, initialValues) {
    const values = [ ...initialValues ];

    for (const ranges of maps) {
        for (let i = 0; i < values.length; i++) {
            values[i] = convertValue(ranges, values[i]);
        }

        console.log(seeds);
    }

}

function main() {
    const seeds = [];
    const maps = [];

    const lines = fs
        .readFileSync('./input.txt')
		.toString()
		.split('\n');

    lines.push('');

    let curMap = [];

    for (const line of lines) {
        if (line.startsWith('seeds:')) {
            line.match(/(\d+)/g).forEach((seed) => {
            console.log(seed, parseInt(seed));
                seeds.push(parseInt(seed));
            });

            continue;
        }

        const ranges = line.match(/(\d+)/g);

        if (ranges) {
            curMap.push(line.split(/\s+/).map(v => parseInt(v)));
        } else if (curMap.length) {
            maps.push(curMap);
            curMap = [];
        }
    }

    for (const ranges of maps) {
        for (let i = 0; i < seeds.length; i++) {
            seeds[i] = convertValue(ranges, seeds[i]);
        }
    }

    console.log(Math.min(...seeds));
}

main();