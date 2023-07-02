import ProgressBar from 'https://deno.land/x/progress@v1.3.8/mod.ts';
import { MoxfieldCard } from './types/MoxfieldDeck.ts';
import { ensureDir } from 'https://deno.land/std@0.192.0/fs/mod.ts';
import { join } from 'https://deno.land/std@0.192.0/path/mod.ts';

const sleep = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

interface DownloadOptions {
	id: string;
	format: string;
	path: string;
	back?: boolean;
	progress?: ProgressBar;
}

const downloadImage = async ({ id, format, path, back, progress }: DownloadOptions) => {
	const params = new URLSearchParams({ format: 'image' });
	params.set('version', format);
	if (back) params.set('face', 'back');
	const url = `https://api.scryfall.com/cards/${id}?${params}`;

	const resPromise = fetch(url);
	const filePromise = Deno.open(path, { write: true, create: true });
	const [res, file] = await Promise.all([resPromise, filePromise]);

	await res.body?.pipeTo(file.writable);

	if (progress) progress.render(++completed);
};

const getCardPath = (outPath: string, name: string, format: string) =>
	join(outPath, `${name}.${format === 'png' ? 'png' : 'jpg'}`);

let completed = 0;
export const downloadImages = async (
	cards: MoxfieldCard[],
	format: string,
	outPath: string,
	showProgress = false
) => {
	const progress = new ProgressBar({
		total: cards.length,
		complete: '=',
		incomplete: '-',
		display: '  🔄 :completed/:total images downloaded [:bar]  '
	});
	if (showProgress) progress.render(0);

	await ensureDir(outPath);

	const promises: Promise<void>[] = [];
	completed = 0;
	for (const card of cards) {
		if (['transform', 'modal_dfc'].includes(card.layout)) {
			promises.push(
				downloadImage({
					id: card.scryfall_id,
					format,
					path: getCardPath(outPath, card.card_faces![0].name, format),
					progress: showProgress ? progress : undefined
				})
			);
			await sleep(50);

			promises.push(
				downloadImage({
					id: card.scryfall_id,
					format,
					path: getCardPath(outPath, card.card_faces![1].name, format),
					back: true,
					progress: showProgress ? progress : undefined
				})
			);
		} else {
			let name = card.name;
			if (name.includes(' // ')) name = name.split(' // ').join(''); // suspect

			promises.push(
				downloadImage({
					id: card.scryfall_id,
					format,
					path: getCardPath(outPath, name, format),
					progress: showProgress ? progress : undefined
				})
			);
		}
		await sleep(50);
	}

	await Promise.all(promises);
};
