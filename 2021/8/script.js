const fs = require('fs');

function main() {
	const data = fs.readFileSync('./data.txt')
		.toString()
		.split('\n')
		.map(line => line.split(' | ').map(parts => parts.split(/\s+/)));

	/* part 1
	let count = 0;

	for (const [patterns, values] of data) {
		for (const value of values) {
			switch (value.length) {
				case 2: // 1
				case 4: // 4
				case 3: // 7
				case 7: // 8
					count++;
			}
		}
	}
	*/

	let result = 0;

	// indices of segments included in a digit
	const digitSegments = [
		'0,1,2,4,5,6', // 0
		'2,5', // 1 
		'0,2,3,4,6', // 2
		'0,2,3,5,6', // 3
		'1,2,3,5', // 4
		'0,1,3,5,6', // 5
		'0,1,3,4,5,6', // 6
		'0,2,5', // 7
		'0,1,2,3,4,5,6', // 8
		'0,1,2,3,5,6', // 9
	];

	const knownBySegmentsCount = {2: 1, 4: 4, 3: 7, 7: 8}; // segments count => digit
	const knownSegmentsByAppearance = {6: 1, 4: 4, 9: 5}; // segment appearance count => segment index

	for (const [patterns, values] of data) {
		const knownPatterns = [];
		const segmentAppearance = {};

		for (const pattern of patterns) {
			// get known patterns by segments count
			if (pattern.length in knownBySegmentsCount) {
				const digit = knownBySegmentsCount[pattern.length];

				knownPatterns[digit] = pattern.split('');
			}

			// count segment appearances
			for (const symbol of pattern) {
				segmentAppearance[symbol] = segmentAppearance[symbol] + 1 || 1;
			}
		}

		const segments = [];

		// get known segments by appearance count
		for (const [symbol, count] of Object.entries(segmentAppearance)) {
			if (count in knownSegmentsByAppearance) {
				const segmentIndex = knownSegmentsByAppearance[count];

				segments[segmentIndex] = symbol;
			}
		}

		segments[0] = knownPatterns[7].filter(s => !knownPatterns[1].includes(s))[0];
		segments[2] = knownPatterns[1].filter(s => !segments.includes(s))[0];
		segments[3] = knownPatterns[4].filter(s => !segments.includes(s))[0];
		segments[6] = knownPatterns[8].filter(s => !segments.includes(s))[0];

		let numericValue = '';

		for (const value of values) {
			const valueSegments = value.split('').map(s => segments.indexOf(s)).sort().join();
			const digit = digitSegments.indexOf(valueSegments);

			numericValue += digit;
		}

		result += parseInt(numericValue, 10);
	}

	console.log(result);
}

main();

