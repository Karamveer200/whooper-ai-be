export const FIELD_LIMITS = {
  submission: {
    minChars: 10,
    maxWords: 2000,
    maxUrlLength: 2048,
  },
  task: {
    title: { min: 3, max: 200 },
    category: { min: 1, max: 100 },
    description: { min: 10, max: 5000 },
    criterion: { min: 1, max: 500 },
    maxCriteria: 20,
    skill: { max: 50 },
    maxSkills: 20,
    payout: { min: 0.01, max: 1_000_000 },
    roughIdea: { min: 10, max: 5000 },
  },
} as const

export const countWords = (text: string): number => {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

export const isWithinWordLimit = (text: string, maxWords: number): boolean =>
  countWords(text) <= maxWords
