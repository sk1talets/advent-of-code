const fs = require('fs');

const pluggableAdaptors = {};
const countForAdapater = {};

function getPathsCount(adapter, count = 0) {
	if (!pluggableAdaptors[adapter].length) {
		return count + 1;
	}

	for (const nextAdapter of pluggableAdaptors[adapter]) {
		if (countForAdapater[nextAdapter]) {
			count += countForAdapater[nextAdapter];
		} else {
			count = getPathsCount(nextAdapter, count);
		}
	}

	return count;
}

function main() {
	const adapters = fs.readFileSync('./adapters.txt')
		.toString().split('\n').map(s => parseInt(s, 10)).sort(((a,b) => a - b));

	let maxJolts = 0;
	
	for (const adapter of adapters) {
		if (adapter > maxJolts) {
			maxJolts = adapter;
		}
	}

	const deviceJolts = maxJolts + 3;

	adapters.unshift(0); // charging outlet
	adapters.push(deviceJolts); // device

	/*
	const diffs = {};

	for (let i = 1; i < adapters.length; i++) {
		let diff = adapters[i] - adapters[i - 1];

		if (diff in diffs) {
			diffs[diff]++
		} else {
			diffs[diff] = 1;
		}
	}

	console.log(diffs[1] * diffs[3]);
	*/

	for (const adapter of adapters) {
		pluggableAdaptors[adapter] = [];
	}

	for (const adapter of adapters) {
		for (let i = 1; i <= 3; i++) {
			if (adapters.includes(adapter + i)) {
				pluggableAdaptors[adapter].push(adapter + i);
			}
		}
	}

	for (const adapter of adapters.slice().reverse()) {
		countForAdapater[adapter] = getPathsCount(adapter);
	}

	console.log(countForAdapater[0]);
}

main();