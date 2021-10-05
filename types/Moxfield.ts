import { z } from '../deps.ts';
import { Card, CardFace } from './Scryfall.ts';

const User = z
    .object({
        userName: z.string(),
        profileImageUrl: z.string().url(),
        badges: z.null().array()
    })
    .strict();

const MoxCardFace = CardFace.extend({
    id: z.string()
}).omit({ object: true });

const MoxCard = Card.partial().extend({
    id: z.string(),
    scryfall_id: z.string().uuid(),
    cardHoarderUrl: z.string().url().optional(),
    cardKingdomUrl: z
        .string()
        .transform((string) => `https://cardkingdom.com/${string}`)
        .optional(),
    cardKingdomFoilUrl: z
        .string()
        .transform((string) => `https://cardkingdom.com/${string}`)
        .optional(),
    cardMarketUrl: z.string().url().optional(),
    tcgPlayerUrl: z.string().url().optional(),
    cn: z.string(),
    type: z.string().optional(),
    etched: z.boolean(),
    glossy: z.boolean(),
    colorshifted: z.boolean(),
    latest: z.boolean(),
    has_multiple_editions: z.boolean(),
    has_arena_legal: z.boolean(),
    isArenaLegal: z.boolean(),
    isToken: z.boolean(),
    defaultFinish: z.string(),
    prices: z.object({
        usd: z.number().optional(),
        usd_foil: z.number().optional(),
        eur: z.number().optional(),
        eur_foil: z.number().optional(),
        tix: z.number().optional(),
        ck: z.number().optional(),
        ck_foil: z.number().optional(),
        lastUpdatedAtUtc: z.string().transform((string) => new Date(string))
    }),
    card_faces: MoxCardFace.array().optional()
});

const DeckEntry = z
    .object({
        quantity: z.number(),
        boardType: z.string(), // TODO: literals
        finish: z.string(), // TODO: literals
        isFoil: z.boolean(),
        isAlter: z.boolean(),
        isProxy: z.boolean(),
        card: MoxCard,
        useCmcOverride: z.boolean(),
        useManaCostOverride: z.boolean(),
        useColorIdentityOverride: z.boolean()
    })
    .strict();

export const Deck = z
    .object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        format: z.string(), // TODO: format literals
        visibility: z.string(), // TODO: visibility literals
        publicUrl: z.string().url(),
        publicId: z.string(),
        likeCount: z.number(),
        viewCount: z.number(),
        commentCount: z.number(),
        areCommentsEnabled: z.boolean(),
        createdByUser: User,
        authors: User.array(),
        main: MoxCard,
        mainboardCount: z.number(),
        mainboard: z.record(DeckEntry),
        sideboardCount: z.number(),
        sideboard: z.record(DeckEntry),
        maybeboardCount: z.number(),
        maybeboard: z.record(DeckEntry),
        commandersCount: z.number(),
        commanders: z.record(DeckEntry),
        companionsCount: z.number(),
        companions: z.record(DeckEntry),
        signatureSpellsCount: z.number(),
        signatureSpells: z.record(DeckEntry),
        tokens: MoxCard.array(),
        hubs: z.null().array(),
        createdAtUtc: z.string().transform((string) => new Date(string)),
        lastUpdatedAtUtc: z.string().transform((string) => new Date(string)),
        exportId: z.string().uuid(),
        authorTags: z.record(z.string().array())
    })
    .strict();

export type Deck = z.output<typeof Deck>;
