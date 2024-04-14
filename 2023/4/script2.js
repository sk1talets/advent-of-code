const fs = require('fs');

function main() {
    const cards = [];

    fs.readFileSync('./input.txt')
		.toString()
		.split('\n')
        .map((line) => {
            const [_, wining, ours] = line.match(/Card\s+\d+:\s+(.+)\s+\|\s+(.+)/);

            const winingNumbers = wining.split(/\s+/);
            const winingAmount = ours
                .split(/\s+/)
                .filter((num) => winingNumbers.includes(num))
                .length;

            cards.push(winingAmount);
        });

    const countCards = (n) => {
        const winingAmount = cards[n];

        let cardsTotal = 1;

        for (let i = n + 1; i <= n + winingAmount; i++) {
            cardsTotal += countCards(i);
        }

        return cardsTotal;
    }

    let cardsTotal = 0;

    for (let i = 0; i < cards.length; i++) {
        cardsTotal += countCards(i);
    }

    console.log(cardsTotal);
}

main();