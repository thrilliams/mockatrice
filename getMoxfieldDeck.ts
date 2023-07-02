import { MoxfieldDeck } from './types/MoxfieldDeck.ts';
import { MoxfieldError } from './types/MoxfieldError.ts';

export const getMoxfieldDeck = async (
	id: string
): Promise<[MoxfieldDeck, null] | [null, MoxfieldError]> => {
	const res = await fetch(`https://api.moxfield.com/v2/decks/all/${id}`);
	const json = await res.json();
	if (res.ok) {
		return [json as MoxfieldDeck, null];
	} else {
		return [null, json as MoxfieldError];
	}
};
