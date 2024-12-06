const fs = require('fs');

function isValidUpdate(update, rules) {
    for (const page of update) {
        for (const prevPage of rules[page] ?? []) {
            if (update.indexOf(prevPage) > update.indexOf(page)) {
                return false;
            }
        }
    }

    return true;
}

function movePage(pages, page, targetPage) {
    pages.splice(pages.indexOf(page), 1);
    pages.splice(pages.indexOf(targetPage) + 1, 0, page);
}

function findRightPlace(pages, page, rules) {
    const prevPages = rules[page] ?? [];
    const prevIndices = prevPages.map((page) => pages.indexOf(page));
    const targetIndex = Math.max(...prevIndices);

    return targetIndex > pages.indexOf(page) ? pages[targetIndex] : 0;
}

function main() {
    const input = fs.readFileSync('./input.txt')
        .toString()
        .split('\n');

    const rules = {};
    const updates = [];

    for (const line of input) {
        if (line.includes('|')) {
            const [prevPage, page] = line.split('|');

            // { page: [ ...the pages that must come before ] }
            rules[page] = rules[page] ? [...rules[page], prevPage] : [prevPage];
        } else if (line) {
            updates.push(line.split(','));
        }
    }

    let result = 0;

    for (const update of updates) {
        if (!isValidUpdate(update, rules)) {
            for (const page of [...update]) {
                const targetPage = findRightPlace(update, page, rules);

                if (targetPage) {
                    movePage(update, page, targetPage);
                }
            }

            result += Number(update[Math.floor(update.length/2)]);
        }
    }

    console.log(result);
}

main();