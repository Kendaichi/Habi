export const MATERIAL_BG: Record<string, string> = {
  Plastic: 'from-[#A0B4C8] to-[#6080A0]',
  Metal: 'from-[#C8A882] to-[#9C7A5A]',
  Bamboo: 'from-[#8FAF8A] to-[#4A7A5A]',
  Textile: 'from-[#BFA9A0] to-[#8A6E65]',
}

export const DEFAULT_BG = 'from-[#C0C8D0] to-[#808890]'

export const MATERIAL_STYLE: Record<
  string,
  { borderColor: string; iconBg: string; emoji: string; sub: string }
> = {
  Plastic: { borderColor: 'border-terracotta', iconBg: 'bg-terracotta/10', emoji: '🧴', sub: 'HDPE & PET Bottles' },
  Metal: { borderColor: 'border-forest', iconBg: 'bg-forest/10', emoji: '⚙️', sub: 'Aluminum & Scrap Iron' },
  Bamboo: { borderColor: 'border-mustard', iconBg: 'bg-mustard/10', emoji: '🌿', sub: 'Bamboo & Timber Offcuts' },
  Textile: { borderColor: 'border-stone-400', iconBg: 'bg-stone-100', emoji: '🧵', sub: 'Fabric & Fiber Waste' },
  Glass: { borderColor: 'border-sky-400', iconBg: 'bg-sky-50', emoji: '🫙', sub: 'Glass Cullet' },
}

export const DEFAULT_STYLE = {
  borderColor: 'border-stone-300',
  iconBg: 'bg-stone-100',
  emoji: '📦',
  sub: 'General Material',
}
