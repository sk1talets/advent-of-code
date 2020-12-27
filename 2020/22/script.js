const fs = require('fs');

function parseInput() {
	const input = fs.readFileSync('./deck.txt').toString().split('\n');

	const deck1 = [];
	const deck2 = [];

	let curDeck = deck1;

	for (const line of input) {
		if (!line) {
			curDeck = deck2;
			continue;
		}

		if (line.startsWith('Player')) {
			continue;
		}

		curDeck.unshift(parseInt(line));
	}

	return [deck1, deck2];
}

function decksRepeated(deck1, deck2, decksSeen) {
	const hashKey = `${deck1.join()}-${deck2.join()}`;

	if (decksSeen[hashKey]) {
		return true;
	}

	decksSeen[hashKey] = true;

	return false;
}

function playGame(deck1, deck2) {
	const decksSeen = {};

	while (deck1.length && deck2.length) {
		if (decksRepeated(deck1, deck2, decksSeen)) {
			return 1; // player 1 wins
		}

		const card1 = deck1.pop();
		const card2 = deck2.pop();

		let roundWinner = card1 > card2 ? 1 : 2;

		if (deck1.length >= card1 && deck2.length >= card2) {
			// play subgame
			const subDeck1 = deck1.slice(-card1);
			const subDeck2 = deck2.slice(-card2);

			roundWinner = playGame(subDeck1, subDeck2);
		}

		if (roundWinner === 1) {
			deck1.unshift(card1);
			deck1.unshift(card2);
		} else {
			deck2.unshift(card2);
			deck2.unshift(card1);
		}
	}

	return deck1.length ? 1 : 2;
}

function main() {
	const [deck1, deck2] = parseInput();

	const winner = playGame(deck1, deck2);
	const winnerDeck = winner === 1 ? deck1 : deck2;

	let score = 0;

	for (let i = 0; i < winnerDeck.length; i++) {
		score += winnerDeck[i] * (i + 1);
	}

	console.log('winner:', winner, score);
}

main();