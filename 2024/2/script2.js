const fs = require('fs');

function isSafeReport(report) {
    const direction = Math.sign(report[1] - report[0]);

    for (let i = 1; i < report.length; i++) {
        const delta = report[i] - report[i - 1];

        if (Math.abs(delta) < 1 || Math.abs(delta) > 3) {
            return false;
        }

        if (direction * delta <= 0) {
            return false;
        }
    }

    return true;
}

function main() {
    const reports = fs.readFileSync('./input.txt')
        .toString()
        .split('\n')
        .map((line) => line.split(/\s+/));

    let validCount = 0;

    for (const report of reports) {
        if (isSafeReport(report)) {
            validCount++;
            continue;
        }

        for (let i = 0; i < report.length; i++) {
            if (isSafeReport(report.toSpliced(i, 1))) {
                validCount++;
                break;
            }
        }
    }

    console.log(validCount);
}

main();