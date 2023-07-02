import { ArgumentValue } from 'https://deno.land/x/cliffy@v0.25.7/flags/types.ts';
import { ValidationError } from 'https://deno.land/x/cliffy@v0.25.7/flags/_errors.ts';

const formats = ['png', 'border_crop', 'art_crop', 'large', 'normal', 'small'];

export const formatType = ({ label, name, value }: ArgumentValue): string => {
	if (!formats.includes(value.toLowerCase()))
		throw new ValidationError(
			`${label} "${name}" must be a valid Scryfall format, but got "${value}". Possible formats are: ${formats.join(
				', '
			)}. Learn more at https://scryfall.com/docs/api/images`
		);

	return value;
};
