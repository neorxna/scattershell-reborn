import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Cell.module.css'
import * as poissonProcess from 'poisson-process'
import { yieldResourceAsync } from '../cell/cellSlice'
import { Grid, Button, Segment } from 'semantic-ui-react'

const extraStyles = {
  gridColumnStyle: {
    padding: '0px'
  },
  segmentStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0px',
    width: '32px',
    height: '32px'
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
    noneActivated
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
    // (settlementCell ? ' cell--settlement' : '') +
    (isHarbour ? ` ${styles.cellHarbour}` : '') +
    (isOcean ? ` ${styles.cellOcean}` : '')

  return (
    <Grid.Column
      key={cell.id}
      className={classNameStr}
      style={{
        ...extraStyles.gridColumnStyle
      }}
      onClick={() => onCellClick(cell)}
      disabled={!showAsLink}
    >
      <div
        style={{
          transition: 'opacity 1s',
          border: '0px',
          opacity:
            isOcean || isHarbour
              ? '0'
              : cellActivated || noneActivated
              ? '1'
              : '0.5',
          ...extraStyles.segmentStyle
        }}
      >
        {cell.cellType}
      </div>
    </Grid.Column>
  )
}
