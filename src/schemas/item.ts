import { z } from 'zod'

export const CATEGORIES = [
  'groente', 'fruit', 'granen', 'peulvruchten', 'noten-zaden',
  'vlees', 'vis-schaaldieren', 'zuivel', 'eieren',
  'dranken-alcohol', 'dranken-non-alcohol',
  'zoetwaren', 'sauzen-kruiden', 'bereid-gerecht', 'overig',
] as const

export const EVIDENCE_LEVELS = ['A', 'B', 'C', 'onbekend'] as const
export const SOURCE_TYPES = ['database', 'guideline', 'review', 'consensus', 'meta-analysis'] as const
export const CONDITIONS = ['jicht', 'migraine', 'nierstenen', 'histamine'] as const

export const SourceSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1),
  type: z.enum(SOURCE_TYPES),
  accessedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum moet YYYY-MM-DD zijn'),
})

export const TRIGGER_TYPES = [
  'populatiebreed',
  'subgroep-bevestigd',
  'subgroep-overschat',
  'onttrekkings-trigger',
  'drug-interactie',
  'context-afhankelijk',
  'individueel-variabel',
  'dosis-afhankelijk',
] as const

export const ScoreObjectSchema = z.object({
  score: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  evidence: z.enum(EVIDENCE_LEVELS),
  sources: z.array(SourceSchema).min(1, 'Elke score vereist minstens één bron'),
  note: z.object({ nl: z.string(), en: z.string().optional() }).optional(),
  confidence: z.enum(['laag', 'middel', 'hoog']).optional(),
  triggerType: z.enum(TRIGGER_TYPES).optional(),
  primaryModulators: z.array(z.string().regex(/^[a-z0-9-]+$/)).max(3).optional(),
})

// Migraine-specifieke variant: triggerType is verplicht bij score >= 2 (CLAUDE.md §3.3).
// Deze regel geldt ALLEEN voor de migraine-as — triggerType is niet van toepassing op
// jicht/nierstenen/histamine, dus die blijven de generieke ScoreObjectSchema gebruiken.
export const MigraineScoreSchema = ScoreObjectSchema.superRefine((val, ctx) => {
  if (val.score >= 2 && val.triggerType === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Migraine score ≥ 2 vereist een triggerType (CLAUDE.md §3.3)',
      path: ['triggerType'],
    })
  }
})

export const FoodItemSchema = z.object({
  id: z.string().regex(/^(\d+|nl-[a-z0-9-]+)$/, 'ID moet USDA FDC ID (cijfers) zijn of nl-prefixed'),
  nevoCode: z.string().optional(),
  name: z.object({ nl: z.string().min(1), en: z.string().min(1) }),
  category: z.enum(CATEGORIES),
  subcategory: z.string().optional(),
  scores: z.object({
    jicht: ScoreObjectSchema.nullable(),
    migraine: MigraineScoreSchema.nullable(),
    nierstenen: ScoreObjectSchema.nullable(),
    histamine: ScoreObjectSchema.nullable(),
  }).refine(
    (scores) => Object.values(scores).filter(s => s !== null).length >= 2,
    { message: 'Minstens 2 van 4 aandoeningen moeten gescoord zijn (rest mag null)' }
  ),
  histamineFlags: z.object({
    liberator: z.boolean(),
    daoBlocker: z.boolean(),
  }).optional(),
  meta: z.object({
    addedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    schemaVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    lastReviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  cluster: z.number().int().positive().optional(),
})

export const DatabaseFileSchema = z.object({
  items: z.array(FoodItemSchema),
})

export type Category = (typeof CATEGORIES)[number]
export type EvidenceLevel = (typeof EVIDENCE_LEVELS)[number]
export type SourceType = (typeof SOURCE_TYPES)[number]
export type Condition = (typeof CONDITIONS)[number]
export type Source = z.infer<typeof SourceSchema>
export type ScoreObject = z.infer<typeof ScoreObjectSchema>
export type FoodItem = z.infer<typeof FoodItemSchema>
export type DatabaseFile = z.infer<typeof DatabaseFileSchema>
