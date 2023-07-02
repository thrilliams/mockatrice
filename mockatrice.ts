import { Command } from 'https://deno.land/x/cliffy@v0.25.7/command/mod.ts';
import { magenta, red, bold } from 'https://deno.land/std@0.192.0/fmt/colors.ts';

import { getMoxfieldDeck } from './getMoxfieldDeck.ts';
import { getCardsFromDeck } from './getCardsFromDeck.ts';
import { formatType } from './formatType.ts';
import { downloadImages } from './downloadImages.ts';

const command = new Command()
	.name('mockatrice')
	.version('2.0')
	.description('Moxfield card image downloader, for use with Cockatrice')
	.option('-o, --out-path <path:string>', 'Specify the output directory.', {
		default: './img'
	})
	.type('format', formatType)
	.option('-f, --format <format:format>', 'Use a specific Scryfall image format.', {
		default: 'png'
	})
	.arguments('<id>')
	.help({ hints: false })
	.action(async ({ outPath, format }, id) => {
		// conform to cliffy formatting style
		console.log();

		const [deck, error] = await getMoxfieldDeck(id);
		if (error !== null)
			return console.log(red(`  ${bold('error')} ${error.status}: ${error.title}\n`));
		console.log(`  ✅ loaded deck ${magenta(deck.name)}\n`);

		const cards = getCardsFromDeck(deck);

		await downloadImages(cards, format, outPath, true);

		console.log(`\n  ✅ all card images downloaded to ${outPath}`);

		// conform to cliffy formatting style
		console.log();
	});

await command.parse(Deno.args);
