import type { RoomPreset } from '@/types/room'

export const ROOM_PRESETS: RoomPreset[] = [
  {
    id: 'sunlit-sala',
    name: 'Sunlit Sala',
    badge: 'Natural Daylight',
    description: 'Best for airy living areas with woven textures and soft corners.',
    tip: 'Stand by the doorway for a full view and let natural light fill the frame.',
    roomTheme: 'Tropical Calm',
    lighting: 'natural',
    materialAffinity: ['Bamboo', 'Textile'],
    accent: '#C8553D',
    floor: '#A47551',
    wall: '#F5EBDD',
  },
  {
    id: 'heritage-den',
    name: 'Heritage Den',
    badge: 'Layered Textures',
    description: 'Ideal for cozy rooms where the AI can emphasize craft details and wall art.',
    tip: 'Capture the wall and seating zone together so patterns and placements read clearly.',
    roomTheme: 'Heritage Warmth',
    lighting: 'soft',
    materialAffinity: ['Textile', 'Bamboo'],
    accent: '#1B5E3F',
    floor: '#7B5A45',
    wall: '#EFE3D5',
  },
  {
    id: 'maker-loft',
    name: 'Maker Loft',
    badge: 'Bold Contrast',
    description: 'Works well for sharper lines, statement pieces, and a modern upcycled feel.',
    tip: 'Keep furniture edges visible so the AI can anchor bolder pieces in the space.',
    roomTheme: 'Crafted Modern',
    lighting: 'dramatic',
    materialAffinity: ['Plastic', 'Bamboo'],
    accent: '#E5A823',
    floor: '#6A4B3B',
    wall: '#EDE2D4',
  },
]

export function getRoomPreset(id: string | null | undefined): RoomPreset {
  return ROOM_PRESETS.find((preset) => preset.id === id) ?? ROOM_PRESETS[0]
}
