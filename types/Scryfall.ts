import { z } from '../deps.ts';

const RelatedCard = z
    .object({
        id: z.string().uuid(),
        object: z.literal('related_card'),
        component: z.union([
            z.literal('token'),
            z.literal('meld_part'),
            z.literal('meld_result'),
            z.literal('combo_piece')
        ]),
        name: z.string(),
        type_line: z.string(),
        uri: z.string().url()
    })
    .strict();

const Colors = z
    .union([
        z.literal('W'),
        z.literal('U'),
        z.literal('B'),
        z.literal('R'),
        z.literal('G'),
        z.literal('C')
    ])
    .array();

const ImageURIs = z
    .object({
        png: z.string().url(),
        border_crop: z.string().url(),
        art_crop: z.string().url(),
        large: z.string().url(),
        normal: z.string().url(),
        small: z.string().url()
    })
    .strict();

export const CardFace = z
    .object({
        artist: z.string().optional(),
        artist_id: z.string().uuid().optional(),
        color_indicator: Colors.optional(),
        colors: Colors.optional(),
        flavor_text: z.string().optional(),
        illustration_id: z.string().uuid().optional(),
        image_uris: ImageURIs.optional(),
        loyalty: z.string().optional(),
        mana_cost: z.string(),
        name: z.string(),
        object: z.literal('card_face'),
        oracle_text: z.string().optional(),
        power: z.string().optional(),
        printed_name: z.string().optional(),
        printed_text: z.string().optional(),
        printed_type_line: z.string().optional(),
        toughness: z.string().optional(),
        type_line: z.string(),
        watermark: z.string().optional()
    })
    .strict();

export const Card = z
    .object({
        // Core Fields
        arena_id: z.number().int().optional(),
        id: z.string().uuid(),
        lang: z.string(),
        mtgo_id: z.number().int().optional(),
        mtgo_foil_id: z.number().int().optional(),
        multiverse_ids: z.number().int().array().optional(),
        tcgplayer_id: z.number().int(),
        tcgplayer_etched_id: z.number().int().optional(),
        cardmarket_id: z.number().int().optional(),
        object: z.literal('card'),
        oracle_id: z.string().uuid(),
        prints_search_uri: z.string().url(),
        rulings_uri: z.string().url(),
        uri: z.string().url(),
        scryfall_uri: z.string().url(),
        // Gameplay Fields
        all_parts: RelatedCard.array().optional(),
        card_faces: CardFace.array().optional(),
        cmc: z.number(),
        color_identity: Colors,
        color_indicator: Colors.optional(),
        colors: Colors.optional(),
        edhrec_rank: z.number().optional(),
        hand_modifier: z.string().optional(),
        keywords: z.string().array(),
        layout: z.string(), // TODO: literals
        legalities: z.record(
            z.union([
                z.literal('legal'),
                z.literal('not_legal'),
                z.literal('restricted'),
                z.literal('banned')
            ])
        ),
        life_modifier: z.string().optional(),
        loyalty: z.string().optional(),
        mana_cost: z.string().optional(),
        name: z.string(),
        oracle_text: z.string().optional(),
        oversized: z.boolean(),
        power: z.string().optional(),
        produced_mana: Colors.optional(),
        reserved: z.boolean(),
        toughness: z.string().optional(),
        type_line: z.string(),
        // Print Fields
        artist: z.string().optional(),
        artist_ids: z.string().uuid().array(),
        booster: z.boolean(),
        border_color: z.union([
            z.literal('black'),
            z.literal('white'),
            z.literal('borderless'),
            z.literal('silver'),
            z.literal('gold')
        ]),
        card_back_id: z.string().uuid(),
        collector_number: z.string(),
        content_warning: z.boolean().optional(),
        digital: z.boolean(),
        finishes: z.string().array(), // TODO: literals
        flavor_name: z.string().optional(),
        flavor_text: z.string().optional(),
        foil: z.boolean(),
        frame_effects: z.string().array().optional(), // TODO: literals
        frame: z.string(), // TODO: literals
        full_art: z.boolean(),
        games: z
            .union([z.literal('paper'), z.literal('arena'), z.literal('mtgo')])
            .array(),
        highres_image: z.boolean(),
        illustration_id: z.string().uuid().optional(),
        image_status: z.union([
            z.literal('missing'),
            z.literal('placeholder'),
            z.literal('lowres'),
            z.literal('highres_scan')
        ]),
        image_uris: ImageURIs.optional(),
        nonfoil: z.boolean(),
        prices: z.object({
            usd: z.string().nullable(),
            usd_foil: z.string().nullable(),
            usd_etched: z.string().nullable(),
            eur: z.string().nullable(),
            tix: z.string().nullable()
        }),
        printed_name: z.string().optional(),
        printed_text: z.string().optional(),
        printed_type_line: z.string().optional(),
        promo: z.boolean(),
        promo_types: z.string().array().optional(), // TODO: literals
        purchase_uris: z.record(z.string().url()),
        rarity: z.union([
            z.literal('common'),
            z.literal('uncommon'),
            z.literal('rare'),
            z.literal('special'),
            z.literal('mythic'),
            z.literal('bonus')
        ]),
        related_uris: z.record(z.string().url()),
        released_at: z.string().transform((string) => new Date(string)),
        reprint: z.boolean(),
        scryfall_set_uri: z.string().url(),
        set_name: z.string(),
        set_search_uri: z.string().url(),
        set_type: z.string(), // TODO: literals
        set_uri: z.string().url(),
        set: z.string(),
        set_id: z.string().uuid(),
        story_spotlight: z.boolean(),
        textless: z.boolean(),
        variation: z.boolean(),
        variation_of: z.string().uuid().optional(),
        watermark: z.string().optional(),
        preview: z
            .object({
                previewed_at: z
                    .string()
                    .transform((string) => new Date(string)),
                source_uri: z.string(),
                source: z.string()
            })
            .strict()
            .optional()
    })
    .strict();

export type Card = z.infer<typeof Card>;
