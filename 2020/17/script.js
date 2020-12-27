const fs = require('fs');

function set(S, x, y, z, w, val) {
	if (!S[w]) {
		S[w] = [];
	}

	if (!S[w][z]) {
		S[w][z] = [];
	}

	if (!S[w][z][y]) {
		S[w][z][y] = [];
	}

	S[w][z][y][x] = val;
}

function get(S, x, y, z, w) {
	if (!S[w]) {
		return 0;
	}

	if (!S[w][z]) {
		return 0;
	}

	if (!S[w][z][y]) {
		return 0;
	}

	return S[w][z][y][x] || 0;
}

function getState(S, x, y, z, w, D = 1) {
	let state = get(S, x, y, z, w);
	let activeNeighbors = 0;

	for (let ww = w - D; ww <= w + D; ww++) {
		for (let zz = z - D; zz <= z + D; zz++) {
			for (let yy = y - D; yy <= y + D; yy++) {
				for (let xx = x - D; xx <= x + D; xx++) {
					if (xx === x && yy === y && zz === z && ww === w) {
						continue;
					}

					activeNeighbors += get(S, xx, yy, zz, ww);
				}
			}
		}
	}

	if (state === 1 && (activeNeighbors !== 2 && activeNeighbors !== 3)) {
		return 0;
	} else if (state === 0 && activeNeighbors === 3) {
		return 1;
	}

	return state;
}

function main() {
	const lines = fs.readFileSync('./input.txt').toString().split('\n');

	const input = [];

	for (const line of lines) {
		input.push(line.split('').map(s => s === '#' ? 1 : 0));
	}
	
	const cycles = 6;

	const states = [[]];
	const active = [];
	
	// initial
	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input.length; x++) {
			set(states[0], x, y, 0, 0, input[y][x]);
		}
	}

	for (let cycle = 1; cycle <= cycles; cycle++) {
		states[cycle] = [];
		active[cycle] = 0;

		for (let w = -cycle; w < input.length + cycle; w++) {
			for (let z = -cycle; z < input.length + cycle; z++) {
				for (let y = -cycle; y < input.length + cycle; y++) {
					for (let x = -cycle; x < input.length + cycle; x++) {
						const state = getState(states[cycle - 1], x, y, z, w);
					
						active[cycle] += state;
						set(states[cycle], x, y, z, w, state);
					}
				}
			}
		}
	}

	console.log(active[cycles]);
 }

main();