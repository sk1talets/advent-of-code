const fs = require('fs');

const rules = [];

function checkMessage(str, ruleId = 0, pos = 0) {
	if (typeof rules[ruleId] === 'string') {
		return str[pos] === rules[ruleId] ? [true, 1] : [false, 0];
	}

	let shift = 0;

	subrule:
	for (const rule of rules[ruleId]) {
		for (const subRule of rule) {
			if (pos + shift > str.length - 1) {
				console.log(str, rule, pos);
				return [true, shift];
			}

			const [ok, shift_] = checkMessage(str, subRule, pos + shift);

			if (!ok) {
				shift = 0;
				continue subrule;
			}
			
			shift += shift_;
		}

		return [true, shift];
	}

	return [false, shift];
}

function main() {
	const lines = fs.readFileSync('./input-test.txt').toString().split('\n');

	let messages;

	for (const line of lines) {
		if (!line) {
			messages = [];
		} else if (messages) {
			messages.push(line);
		} else {
			const [numRaw, rulesRaw] = line.split(': ');
			const num = parseInt(numRaw);
			let ruleSet = [];

			rules[num] = [];
			for (const token of rulesRaw.split(' ')) {
				if (token[0] === '"') {
					rules[num] = token[1]; // "a"
				}  else {
					if (token === '|') {
						rules[num].push(ruleSet);
						ruleSet = [];
					} else {
						ruleSet.push(parseInt(token));
					}
				}
			}

			if (ruleSet.length) {
				rules[num].push(ruleSet);
			}
		}
	}

	// second part fix
	rules[8] = [[42], [42, 8]];
	rules[11] = [[42, 31], [42, 11, 31]]


	let count = 0;

	for (const message of messages) {
		const [ok, matched] = checkMessage(message);

		count += ok && matched === message.length;
	}

	console.log(count);
}

main();