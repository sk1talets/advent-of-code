const fs = require('fs');

function main() {
    const code = fs.readFileSync('./input.txt').toString();
    const regexp = /mul\((\d+),(\d+)\)/g;

    let result = 0;
    let match;

    while (match = regexp.exec(code)) {
        result += match[1] * match[2];
    }

    console.log(result);
}

main();