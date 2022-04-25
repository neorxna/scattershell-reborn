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
  gridContainer: {
  }
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
      <Grid
        
        columns={cells[0].length}
        style={{
          
        }}
      >
        {cells.map((row, rowIndex) => (
          <Grid.Row
            style={{ padding: '0px', flexWrap: 'nowrap' }}
            key={rowIndex}
          >
            {row.map(cell => {
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
                    noneActivated
                  }}
                  key={cell.id}
                />
              )
            })}
          </Grid.Row>
        ))}
      </Grid>
  )
}
