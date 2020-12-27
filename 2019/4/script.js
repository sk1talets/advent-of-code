function main() {
	let N = 0;

	main:
	for (let n = 171309; n <= 643603; n++) {
		ns = n.toString();
	
		sameTwoAdjacent = false;

		for (let i = 0; i < ns.length - 1; i++) {
			if (!sameTwoAdjacent && ns[i] === ns[i+1]) {
				sameTwoAdjacent = true;

				if (ns[i-1] && ns[i-1] === ns[i]) {
					sameTwoAdjacent = false;
				}

				if (ns[i+2] && ns[i+2] === ns[i]) {
					sameTwoAdjacent = false;
				}
			}

			if (parseInt(ns[i]) > parseInt(ns[i+1])) {
				continue main;
			}
		}

		if (sameTwoAdjacent) {
			N++;
		}
	}

	console.log(N);
}

main();