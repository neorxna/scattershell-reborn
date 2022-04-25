export const CellTypes = {
  Undecided: '?',
  Food: '🌿',
  Materials: '🛠️',
  Settlement: '🌱',
  Grass: '🌲',
  Lagoon: '💧',
  Desert: '🌾',
  Mountain: '⛰️'
}

/* 
  Grasslands
  Highlands
  Swamp/Mangrove
  Rainforest
  Lagoon
*/

export const CellTypesLabel = {
  [CellTypes.Undecided]: 'undecided',
  [CellTypes.Food]: 'food',
  [CellTypes.Materials]: 'materials',
  [CellTypes.Settlement]: 'settlement',
  [CellTypes.Grass]: 'grass',
  [CellTypes.Lagoon]: 'lagoon',
  [CellTypes.Desert]: 'desert',
  [CellTypes.Mountain]: 'mountain'
}

export const IslandSizes = {
  Tiny: 2,
  Small: 3,
  Medium: 5,
  Large: 8
}

export const maxTiles = size => size + Math.floor(size / 2)
