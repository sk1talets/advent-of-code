function setCups(nums) {
	const cups = [];

	let pos;
	let first;

	for (let num of nums) {
		if (pos) {
			cups[pos] = num;
		} else {
			first = num;
		}
		
		pos = num;
	}

	cups[pos] = first;

	return cups;
}

function print(cups) {
	let count = 1;
	let cur = 3;

	while (count < cups.length) {
		process.stdout.write(`${cur} `);
		cur = cups[cur];
		count++;
	}
	process.stdout.write('\n');
}

function main() {
	const input = '315679824';
	// const input = '389125467';
	const moves = 10000000;

	const cups0 = input.split('').map(n => parseInt(n));
	const cups = setCups(cups0);
	const firstCup = cups0[0];

	const minCups0 = Math.min(...cups0);
	const maxCups0 = Math.max(...cups0);

	const minCup = minCups0;
	const maxCup = 1000000;

	cups[cups0[cups0.length - 1]] = maxCups0 + 1;

	for (let num = maxCups0 + 2; num <= maxCup; num++) {
		cups[num - 1] = num;
	}

	cups[maxCup] = firstCup;

	let curCup = firstCup;

	for (let move = 1; move <= moves; move++) {
		const picked = [
			cups[curCup],
			cups[cups[curCup]],
			cups[cups[cups[curCup]]],
		];

		let destCup = curCup;

		while (true) {
			destCup--;

			if (destCup < minCup) {
				destCup = maxCup;
			}

			if (picked.includes(destCup)) {
				continue;
			}

			break;
		}

		// cur point to the first after picked
		cups[curCup] = cups[picked[picked.length - 1]];
		
		// last picked to point to the cup after dest
		cups[picked[picked.length - 1]] = cups[destCup];

		// dest cup to point to first picked
		cups[destCup] = picked[0];

		curCup = cups[curCup];

		//print(cups);
	}

	console.log(cups[1], cups[cups[1]], cups[1] * cups[cups[1]]);
}

main();