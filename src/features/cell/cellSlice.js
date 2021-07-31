import { createSlice, createSelector } from '@reduxjs/toolkit'
import { generateIsland } from '../island/generateIsland'
import world from '../island/world'
import { CellTypes, maxTiles } from '../island/properties'

export const cellSlice = createSlice({
  name: 'cell',
  initialState: {
    byId: {},
    activatableByIslandId: {}, // stores the ids of cells that can be activated. */
    deactivatableByIslandId: {} /* stores the ids of activated cells that can be deactivated. */,
    activatedByIslandId: {} /* stores the ids of cells that have been activated */,
    harbourByIslandId: {} /* stores the ids of cells that are harbours */
  },
  reducers: {
    resetIsland: (state, action) => {
      const { islandId } = action.payload
      state.activatableByIslandId[islandId] = []
      state.deactivatableByIslandId[islandId] = []
      state.activatedByIslandId[islandId] = []
      state.harbourByIslandId[islandId] = []
    },
    generateGrid: (state, action) => {
      const { islandId } = action.payload
      const { size } = world[islandId]
      const cells = generateIsland(size)

      state.activatableByIslandId[islandId] = []
      state.deactivatableByIslandId[islandId] = []
      state.activatedByIslandId[islandId] = []
      state.harbourByIslandId[islandId] = []

      cells.forEach(cell => {
        const col = cell.pos % size
        const row = Math.floor(cell.pos / size)
        const id = `${islandId}:${row}_${col}`

        let neighbours = {}
        if (col > 0) neighbours['n'] = `${islandId}:${row}_${col - 1}`
        if (col < size - 1) neighbours['s'] = `${islandId}:${row}_${col + 1}`
        if (row > 0) neighbours['w'] = `${islandId}:${row - 1}_${col}`
        if (row < size - 1) neighbours['e'] = `${islandId}:${row + 1}_${col}`

        state.byId[id] = {
          ...cell,
          id,
          row,
          col,
          islandId,
          neighbours
        }
      })
    },
    toggleActivated: (state, action) => {
      const { cellId } = action.payload
      const islandId = cellId.split(':')[0]

      const activatedCells = () => state.activatedByIslandId[islandId]
      const deactivatableCells = () => state.deactivatableByIslandId[islandId]
      const activatableCells = () => state.activatableByIslandId[islandId]

      const cellActivated = () => activatedCells().indexOf(cellId) !== -1
      const cellNeighbourIds = () =>
        Object.entries(state.byId[cellId].neighbours).map(([dir, id]) => id)
      const cellCanDeactivate = () =>
        deactivatableCells().indexOf(cellId) !== -1
      const cellCanActivate = () =>
        (activatableCells().indexOf(cellId) !== -1 ||
          activatableCells().length === 0) &&
        activatedCells().length < maxTiles(world[islandId].size)

      if (cellActivated() && cellCanDeactivate()) {
        /** * Deactivating ***

        /* Manage activated */
        // mark the cell deactivated and activatable
        const activatedCellRemovedUpdate = activatedCells().filter(
          otherId => otherId !== cellId
        )
        state.activatedByIslandId[islandId] = activatedCellRemovedUpdate

        if (
          activatableCells().indexOf(cellId) === -1 &&
          activatedCells().length !== 0
        ) {
          state.activatableByIslandId[islandId].push(cellId)
        }

        /* Manage activatable */
        // for each neighbour, check if that cell still has at least 1 neighbour.
        cellNeighbourIds().forEach(neighbourId => {
          const secondNeighbourIds = Object.entries(
            state.byId[neighbourId].neighbours
          ).map(([dir, id]) => id)

          const numActiveNeighbours = secondNeighbourIds.filter(
            secondNeighbourId =>
              activatedCells().indexOf(secondNeighbourId) !== -1
          ).length

          // remove the neighbour if it has been left with no active neighbours
          if (numActiveNeighbours === 0) {
            state.activatableByIslandId[islandId] = activatableCells().filter(
              otherId => otherId !== neighbourId
            )
          }
        })
      } else if (!cellActivated() && cellCanActivate()) {
        /** * Activating ***/
        /* Manage activated */

        // mark the cell activated and activatable
        state.activatedByIslandId[islandId].push(cellId)
        state.activatableByIslandId[islandId] = activatableCells().filter(
          id => id !== cellId
        )

        /* Manage activatable */
        // mark all non-activated neighbours of this cell as activatable
        cellNeighbourIds().forEach(neighbourId => {
          if (
            activatableCells().indexOf(neighbourId) === -1 &&
            activatedCells().indexOf(neighbourId) === -1
          ) {
            state.activatableByIslandId[islandId].push(neighbourId)
          }
        })
      }

      /* Manage unactivatable
         For every activated cell on the same island,
         run the bfs search for connected components
         (after above changes have taken place)
       */

      let deactivatableUpdate = []

      activatedCells().forEach(id => {
        let bfsQueue = []
        let visited = {}
        let current = null
        let allowDeactivate = false

        // simulate removing this id.
        const deactivatedSimulation = activatedCells().filter(
          otherId => otherId !== id
        )

        if (deactivatedSimulation.length === 0) {
          // cell is the only one activated.
          allowDeactivate = true
        } else {
          bfsQueue.push(deactivatedSimulation[0])
          while (bfsQueue.length > 0) {
            current = bfsQueue.shift()
            if (!visited[current]) {
              visited[current] = true
              // add activated neighbours to the queue
              Object.entries(state.byId[current].neighbours)
                .filter(
                  ([dir, neighbourId]) =>
                    deactivatedSimulation.indexOf(neighbourId) !== -1
                )
                .forEach(([dir, neighbourId]) => {
                  bfsQueue.push(neighbourId)
                })
            }
          }
          // any activated cells on the same island that were not visited?
          const unvisited = deactivatedSimulation.filter(
            id => visited[id] == undefined
          )
          const connected = unvisited.length === 0
          if (connected) {
            allowDeactivate = true
          }
        }
        if (allowDeactivate) {
          deactivatableUpdate.push(id)
        }
      })

      state.deactivatableByIslandId[islandId] = deactivatableUpdate

      /* recompute harbours for this island */

      state.harbourByIslandId[islandId] = activatableCells().filter(cellId => {
        return (
          Object.entries(state.byId[cellId].neighbours)
            .map(([dir, neighbourId]) => neighbourId)
            .reduce((acc, neighbourId) => {
              return (
                acc + (activatedCells().indexOf(neighbourId) === -1 ? 0 : 1)
              )
            }, 0) > 1
        )
      })
    }
  }
})

export const {
  generateGrid,
  toggleActivated,
  yieldResource,
  resetIsland
} = cellSlice.actions

export const selectCellById = state => state.cell.byId

export const selectCellsByIsland = islandId_ => state =>
  Object.values(state.cell.byId).filter(({ islandId }) => islandId === islandId_)

export const selectCells2d = islandId =>
  createSelector([selectCellById], cells => {
    const { size } = world[islandId]
    const nDimension = [...Array(size).keys()]

    // only return a result when the island has been generated.
    if (cells[`${islandId}:0_0`] === undefined) {
      return undefined
    }

    return nDimension.map(row =>
      nDimension.map(col => cells[`${islandId}:${row}_${col}`])
    )
  })

export const selectDeactivatableIds = islandId => state =>
  state.cell.deactivatableByIslandId[islandId] || []

export const selectActivatableIds = islandId => state =>
  state.cell.activatableByIslandId[islandId] || []

export const selectActivatedIds = islandId => state =>
  state.cell.activatedByIslandId[islandId] || []

export const selectHarbourIds = islandId => state =>
  state.cell.harbourByIslandId[islandId] || []

// assumes the island size does not change
export const selectRemainingActivations = islandId =>
  createSelector(
    [selectActivatedIds(islandId)],
    cellIds => maxTiles(world[islandId].size) - cellIds.length
  )

// assuming celltype can change through the course of the game
export const selectIslandHasMountain = islandId =>
  createSelector(
    [selectActivatedIds(islandId), selectCellById],
    (cellIds, cells) =>
      cellIds.reduce(
        (acc, id) => acc || cells[id].cellType === CellTypes.Mountain,
        false
      )
  )

export default cellSlice.reducer
