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

    let validReports = 0;

    for (const report of reports) {
        validReports += isSafeReport(report);
    }

    console.log(validReports);
}

main();