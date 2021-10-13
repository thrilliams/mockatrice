import {
    parse,
    ensureFile,
    copy,
    readerFromStreamReader,
    delay,
    join,
    ProgressBar
} from './deps.ts';

import { Deck } from './types/Moxfield.ts';
import { Card } from './types/Scryfall.ts';

// verify ability to run

const args = parse(Deno.args);
const deckId: string | undefined = args.d || args.deck;

if (typeof deckId !== 'string') {
    console.log('Please pass a Moxfield deck ID.');
    Deno.exit(1);
}

console.log(
    'Notice: The Moxfield API is unstable, not designed for public consumption, and prone to breaking changes. As such, this tool is not likely to be 100% reliable.\n'
);

// run

const moxfieldEndpoint = 'https://api.moxfield.com/v2/decks/all/';
const scryfallEndpoint = 'https://api.scryfall.com/cards/';

async function main() {
    const mresp = await fetch(moxfieldEndpoint + deckId);
    const mjson = await mresp.json();
    const deck = Deck.parse(mjson);

    console.log(`Loaded deck "${deck.name}".\n`);

    const cardList = new Map();
    let oldsize = 0;

    if (deck.commandersCount > 0) {
        for (const entry of Object.values(deck.commanders)) {
            cardList.set(entry.card.scryfall_id, entry.card);
        }
        console.log(
            `Found ${cardList.size} new, unique commander${
                cardList.size === 1 ? '' : 's'
            }.`
        );
    }
    if (deck.companionsCount > 0) {
        oldsize = cardList.size;
        for (const entry of Object.values(deck.companions)) {
            cardList.set(entry.card.scryfall_id, entry.card);
        }
        console.log(
            `Found ${cardList.size - oldsize} new, unique companion${
                cardList.size - oldsize === 1 ? '' : 's'
            }.`
        );
    }
    if (deck.signatureSpellsCount > 0) {
        oldsize = cardList.size;
        for (const entry of Object.values(deck.signatureSpells)) {
            cardList.set(entry.card.scryfall_id, entry.card);
        }
        console.log(
            `Found ${cardList.size - oldsize} new, unique signature spell${
                cardList.size - oldsize === 1 ? '' : 's'
            }.`
        );
    }
    if (deck.mainboardCount > 0) {
        oldsize = cardList.size;
        for (const entry of Object.values(deck.mainboard)) {
            cardList.set(entry.card.scryfall_id, entry.card);
        }
        console.log(
            `Found ${cardList.size - oldsize} new, unique mainboard card${
                cardList.size - oldsize === 1 ? '' : 's'
            }.`
        );
    }
    if (deck.sideboardCount > 0) {
        oldsize = cardList.size;
        for (const entry of Object.values(deck.sideboard)) {
            cardList.set(entry.card.scryfall_id, entry.card);
        }
        console.log(
            `Found ${cardList.size - oldsize} new, unique sideboard card${
                cardList.size - oldsize === 1 ? '' : 's'
            }.`
        );
    }

    console.log();
    let progress = new ProgressBar({
        title: 'Querying Scryfall:',
        total: cardList.size
    });

    const cards: Card[] = [];
    for (let i = 0; i < cardList.size; i++) {
        const resp = await fetch(scryfallEndpoint + [...cardList][i][0]);
        const json = await resp.json();
        cards.push(Card.parse(json));
        await delay(75);
        progress.render(cards.length);
    }

    console.log();
    progress = new ProgressBar({
        title: 'Downloading images:',
        total: cards.length
    });

    for (let i = 0; i < cards.length; i++) {
        if (['modal_dfc', 'transform'].includes(cards[i].layout)) {
            for (const face of cards[i].card_faces!) {
                await downloadImage(
                    deck.publicId,
                    face.name,
                    face.image_uris!.png
                );
                await delay(75);
            }
        } else {
            let name = cards[i].name;
            if (name.includes(' // ')) name = name.split(' // ').join('');
            await downloadImage(deck.publicId, name, cards[i].image_uris!.png);
            await delay(75);
        }
        progress.render(i + 1);
    }
}

async function downloadImage(deckId: string, name: string, uri: string) {
    const path = join(args.p || args.path || './img', `${name}.png`);
    await ensureFile(path);
    const file = await Deno.open(path, {
        write: true
    });

    const resp = await fetch(uri);
    const reader = readerFromStreamReader(resp.body!.getReader());

    await copy(reader, file);
    file.close();
}

main();
