import { MoxfieldBoard, MoxfieldCard, MoxfieldDeck } from './types/MoxfieldDeck.ts';

export const getCardsFromDeck = (deck: MoxfieldDeck) => {
	let cards: { [key: string]: { card: MoxfieldCard } } = {};
	for (const board of Object.values(MoxfieldBoard)) {
		cards = { ...cards, ...deck[board] };
	}
	return Object.values(cards).map((entry) => entry.card);
};
