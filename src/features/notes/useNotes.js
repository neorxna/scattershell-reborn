import { CellTypes } from '../island/properties'
import { useSelector } from 'react-redux'
import { selectIslandById } from '../island/islandSlice'
import {
  selectActivatedIds,
  selectHarbourIds,
  selectCellsByIsland
} from '../cell/cellSlice'

export function useNotes (islandId) {
  let notes = []
  let messages = []
  let stuff = {}

  const { id, size } = useSelector(selectIslandById(islandId))
  const cells = useSelector(selectCellsByIsland(id))
  const activatedCells = useSelector(selectActivatedIds(islandId))
  const harbourCells = useSelector(selectHarbourIds(islandId))

  const activatedNeighbours = cell =>
    Object.values(cell.neighbours).filter(cellId =>
      activatedCells.includes(cellId)
    )

  const oneSettlementActivated =
    cells.filter(
      ({ id, cellType }) =>
        activatedCells.includes(id) && cellType === CellTypes.Settlement
    ).length > 0

  const lagoonWithFourNeighbours =
    cells.filter(({ id, cellType, ...cell }) => {
      if (activatedCells.includes(id) && cellType === CellTypes.Lagoon) {
        return activatedNeighbours(cell).length === 4
      } else {
        return false
      }
    }).length > 0

  if (oneSettlementActivated) {
    if (oneSettlementActivated) messages.push('✔ settlement')
  } else {
    messages.push(
      `need settlement (${CellTypes.Settlement})`
    )
  }

  if (size > 2) {
    // all settlements must be adjacent to two activated cells
    let settlements = cells.filter(
      ({ id, cellType }) =>
        activatedCells.includes(id) && cellType === CellTypes.Settlement
    )
    let allHaveAdjacent =
      settlements.length > 0 &&
      settlements.filter(cell => {
        return activatedNeighbours(cell).length > 1
      }).length === settlements.length
    if (allHaveAdjacent) {
      messages.push('✔ two neighbours per settlement')
    } else if (settlements.length > 0) {
      messages.push('settlements need two neighbours')
    }
  }

  if (size >= 8) {
    const mountainActivated =
      cells.filter(
        ({ id, cellType }) =>
          activatedCells.includes(id) && cellType === CellTypes.Mountain
      ).length > 0
    if (mountainActivated) messages.push('️✔ mountain')
    else messages.push(`need one mountain (${CellTypes.Mountain})`)
  }

  cells.forEach(({ id, contains }) => {
    if (activatedCells.includes(id) && contains && contains.length > 0) {
      contains.forEach(
        item => (stuff[item] = stuff[item] ? stuff[item] + 1 : 1)
      )
    }
  })

  const numHarbours = cells.filter(({ id }) => harbourCells.includes(id)).length
  if (numHarbours > 0) {
    notes.push(`${numHarbours} fishing harbour${numHarbours > 1 ? 's' : ''}`)
  }

  for (let [thing, num] of Object.entries(stuff)) {
    notes.push(`${thing} ${num > 1 ? `x${num}` : ''}`)
  }

  return { messages, notes }
}
