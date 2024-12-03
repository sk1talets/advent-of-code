const fs = require('fs');

function main() {
    const code = fs.readFileSync('./input.txt').toString();
    const regexp = /do(?:n't)*\(\)|mul\((\d+),(\d+)\)/g;

    let result = 0;
    let mulEnabled = true;
    let match;

    while (match = regexp.exec(code)) {
        const [F, arg1, arg2] = match;

        switch (F) {
            case 'do()':
                mulEnabled = true;
                break;
            case 'don\'t()':
                mulEnabled = false;
                break;
            default:
                result += mulEnabled ? arg1 * arg2 : 0;
        }
    }

    console.log(result);
}

main();