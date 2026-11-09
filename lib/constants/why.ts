export interface ProofItem {
  id: string
  value: string
  label: string
  detail?: string
  variant: 'hero' | 'mini' | 'block' | 'wide' | 'rating'
}

export const PROOF_ITEMS: ProofItem[] = [
  {
    id: 'ranked',
    value: '#1',
    label: 'Ranked Business Setup Consultancy in UAE',
    variant: 'hero',
  },
  {
    id: 'years',
    value: '708',
    label: 'Verified Reviews',
    variant: 'mini',
  },
  {
    id: 'companies',
    value: 'Global',
    label: 'Corporate Services',
    variant: 'block',
  },
  {
    id: 'clients',
    value: 'End to End',
    label: 'Setup and Compliance',
    variant: 'block',
  },
  {
    id: 'tax',
    value: 'Tax',
    label: 'Advisory and Compliance',
    variant: 'wide',
  },
  {
    id: 'rating',
    value: '4.8',
    label: 'Average Rating',
    detail: '708 Reviews',
    variant: 'rating',
  },
]

export const WHY_CAPTION =
  'A trusted partner for founders, growth-stage companies, and global businesses building in the UAE.'

export const WHY_PANEL_STATS = [
  { id: 'ranked', value: '#1', label: 'Ranked in UAE' },
  { id: 'countries', value: 'Global', label: 'Jurisdictions' },
  { id: 'reviews', value: '708', label: 'Verified Reviews' },
  { id: 'rating', value: '4.8', label: 'Average Rating' },
] as const
