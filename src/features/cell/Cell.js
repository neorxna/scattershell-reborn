import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Cell.module.css'
import * as poissonProcess from 'poisson-process'
import { yieldResourceAsync } from '../cell/cellSlice'
import { Grid, Button, Segment } from 'semantic-ui-react'
import { CellTypes } from '../island/properties'

const extraStyles = {
  gridColumnStyle: {
    padding: '0px'
  },
  segmentStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0px',
    width: '30px',
    height: '30px',
    fontSize: '1.4em'
  }
}

export function IslandCell (props) {
  const {
    showAsLink,
    cellActivated,
    canActivate,
    allActivated,
    isHarbour,
    cell,
    onCellClick,
    isOcean,
    noneActivated,
    isTopLeft,
    isTopRight,
    isBottomLeft,
    isBottomRight
  } = props

  // todo use styled-components
  const classNameStr =
    styles.cell +
    (cellActivated
      ? ` ${styles.cellActivated}`
      : ` ${styles.cellUnactivated}`) +
    (!showAsLink ? ` ${styles.cellBlocked}` : '') +
    (!cellActivated && !canActivate && !noneActivated
      ? ` ${styles.cellUnactivatable}`
      : '') +
    (cell.cellType === CellTypes.Settlement
      ? ` ${styles.cellSettlement}`
      : '') +
    (canActivate ? ` ${styles.cellCanActivate}` : '') +
    (isHarbour ? ` ${styles.cellHarbour}` : '') +
    (isOcean ? ` ${styles.cellOcean}` : '') +
    (noneActivated ? ` ${styles.noneActivated}` : '')

  return (
    <Grid.Column
      key={cell.id}
      onClick={() => onCellClick(cell)}
      disabled={!showAsLink}
      className={classNameStr}
      style={{
        transition: 'opacity 1s',
        borderTopLeftRadius: isTopLeft ? '0.28rem' : '0px',
        borderTopRightRadius: isTopRight ? '0.28rem' : '0px',
        borderBottomLeftRadius: isBottomLeft ? '0.28rem' : '0px',
        borderBottomRightRadius: isBottomRight ? '0.28rem' : '0px',
        ...extraStyles.segmentStyle
      }}
    >
      {((canActivate && !allActivated) ||
        isHarbour ||
        cellActivated ||
        (noneActivated && cell.cellType === CellTypes.Settlement)) && (
        <span
          style={{ opacity:
            isOcean
              ? '0'
              : cellActivated || noneActivated
              ? '1'
              : (isHarbour && allActivated) ? '0' 
              : '0.5',
          }}
        >
          {cell.cellType}
        </span>
      )}
    </Grid.Column>
  )
}
