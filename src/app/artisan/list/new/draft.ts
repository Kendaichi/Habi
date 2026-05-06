const DRAFT_KEY = 'habi-new-listing'

export type ListingDraft = {
  materialType: string
  listings: { type: string; price: number }[]
  name: string
  description: string
}

export function saveDraft(patch: Partial<ListingDraft>) {
  const existing: Partial<ListingDraft> = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? '{}')
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...existing, ...patch }))
}

export function readDraft(): Partial<ListingDraft> {
  return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? '{}')
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY)
}
