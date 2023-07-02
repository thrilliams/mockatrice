export enum MoxfieldBoard {
	Stickers = 'stickers',
	Attractions = 'attractions',
	Considering = 'maybeboard',
	Sideboard = 'sideboard',
	Mainboard = 'mainboard',
	Companions = 'companions',
	SignatureSpell = 'signatureSpell',
	Commanders = 'commanders'
}

export type MoxfieldDeck = {
	[board in MoxfieldBoard]: { [card: string]: { card: MoxfieldCard } };
} & {
	name: string;
};

export interface MoxfieldCard {
	scryfall_id: string;
	name: string;
	layout: string;
	card_faces?: { name: string }[];
}
