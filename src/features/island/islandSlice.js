import { createSlice, createSelector } from '@reduxjs/toolkit'
import world from './world'

const initialIslandById = Object.fromEntries(
  Object.entries(world).map(([islandId, island]) => {
    return [
      islandId,
      {
        ...island
      }
    ]
  })
)

export const islandSlice = createSlice({
  name: 'island',
  initialState: {
    byId: initialIslandById
  }
})

export default islandSlice.reducer

export const { confirmIsland } = islandSlice.actions

export const allCellsActivated = islandId => state =>
  state.island.byId[islandId].remainingActivations === 0

export const noCellsActivated = islandId => state =>
  state.island.byId[islandId].remainingActivations ===
  state.island.byId[islandId].size

export const selectIslandById = islandId => state => state.island.byId[islandId]
