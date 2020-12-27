const fs = require('fs');
const { exit } = require('process');
const Joi = require('joi');

const schema = Joi.object({
/*	
	byr: Joi.string(),
	iyr: Joi.string(),
	eyr: Joi.string(),
	hgt: Joi.string(),
	hcl: Joi.string(),
	ecl: Joi.string(),
	pid: Joi.string(),
	cid: Joi.string().optional()
*/
	byr: Joi.number().min(1920).max(2002),
	iyr: Joi.number().min(2010).max(2020),
	eyr: Joi.number().min(2020).max(2030),
	hgt: Joi.string().custom((value, helpers) => {
		const match = value.match(/^(\d+)(cm|in)$/)

		if (!match) {
			return helpers.error('any.invalid')
		}

		const [_, valStr, units ] = match;
		
		val = parseInt(valStr, 10);

		if (units === 'cm' && val >= 150 && val <= 193) {
			return value;
		}

		if (units === 'in' && val >= 59 && val <= 76) {
			return value;
		}

		return helpers.error('any.invalid');
	}),
	hcl: Joi.string().pattern(new RegExp(/^#[0-9a-f]{6}$/)),
	ecl: Joi.string().valid('amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'),
	pid: Joi.string().pattern(new RegExp(/^[0-9]{9}$/)),
	cid: Joi.string().optional()
}).options({presence: 'required'});;

function main() {
	const lines = fs.readFileSync('./passports.txt').toString().split('\n').map(l => l.trim());

	let validCount = 0;
	let curPassport = {};

	lines.push('');

	for (const line of lines) {
		if (!line) {
			const result = schema.validate(curPassport);

			if (!result.error) {
				console.log('valid', curPassport);
				validCount++;
			} else {
				console.log('invalid', curPassport, result.error.details);
			}

			curPassport = {}

			continue;
		}

		for (const field of line.split(/\s+/)) {
			const [key, value] = field.split(':');

			if (!value) {
				console.log('invalid line:', line);
				exit(1);
			}

			curPassport[key] = value;
		}
	}

	console.log(validCount);
}

main();