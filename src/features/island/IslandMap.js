import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectIslandById } from './islandSlice'
import { Grid, List, Segment } from 'semantic-ui-react'
import { maxTiles } from './properties'
import {
  selectCells2d,
  toggleActivated,
  selectActivatableIds,
  selectDeactivatableIds,
  selectActivatedIds,
  selectHarbourIds,
  selectRemainingActivations,
  selectCellById,
  selectCellsByIsland
} from '../cell/cellSlice'
import { IslandCell } from '../cell/Cell'

const styles = {
  gridContainer: {}
}

export function IslandMap ({ islandId }) {
  const dispatch = useDispatch()

  /* Cell selectors */

  const cells = useSelector(selectCells2d(islandId))
  const activatedCells = useSelector(selectActivatedIds(islandId))
  const activatableCells = useSelector(selectActivatableIds(islandId))
  const deactivatableCells = useSelector(selectDeactivatableIds(islandId))
  const harbourCells = useSelector(selectHarbourIds(islandId))

  /* Island selectors */

  const island = useSelector(selectIslandById(islandId))
  const remainingActivations = useSelector(selectRemainingActivations(islandId))
  const allActivated = remainingActivations === 0
  const noneActivated = remainingActivations === maxTiles(island.size)

  const onCellClick = cell => {
    dispatch(toggleActivated({ islandId, cellId: cell.id }))
  }

  return !cells ? (
    <></>
  ) : (
    <div style={{
      display: 'flex', padding: '0px', flexDirection: 'column', flexWrap: 'nowrap'
    }}>
      {cells.map((row, rowIndex) => (
        <div style={{ display: 'flex', padding: '0px', flexWrap: 'nowrap' }} key={rowIndex}>
          {row.map((cell, colIndex) => {
            const cellActivated = activatedCells.indexOf(cell.id) !== -1
            const hasRemainingActivations = remainingActivations > 0
            const canActivate = activatableCells.indexOf(cell.id) !== -1
            const canDeactivate = deactivatableCells.indexOf(cell.id) !== -1
            const isHarbour = harbourCells.indexOf(cell.id) !== -1
            const isOcean = allActivated && !isHarbour && !cellActivated

            const showAsLink =
              (island.confirmed && !isOcean && !isHarbour) ||
              (cellActivated && canDeactivate) ||
              (hasRemainingActivations && canActivate) ||
              noneActivated

            const isTopLeft = rowIndex === 0 && colIndex === 0
            const isTopRight = rowIndex === 0 && colIndex === row.length - 1
            const isBottomLeft = rowIndex === cells.length - 1 && colIndex === 0
            const isBottomRight =
              rowIndex === cells.length - 1 && colIndex === row.length - 1

            return (
              <IslandCell
                {...{
                  cell,
                  cellActivated,
                  canActivate,
                  showAsLink,
                  onCellClick,
                  isHarbour,
                  isOcean,
                  allActivated,
                  noneActivated,
                  isTopLeft,
                  isTopRight,
                  isBottomLeft,
                  isBottomRight
                }}
                key={cell.id}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
