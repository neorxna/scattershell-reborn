import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Cell.module.css'
import * as poissonProcess from 'poisson-process'
import { yieldResourceAsync } from '../cell/cellSlice'
import { Grid, Button, Segment } from 'semantic-ui-react'

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
    (!cellActivated && !canActivate && !noneActivated ? ` ${styles.cellUnactivatable}` : '') +
    // (settlementCell ? ' cell--settlement' : '') +
    (isHarbour ? ` ${styles.cellHarbour}` : '') +
    (isOcean ? ` ${styles.cellOcean}` : '')

  return (
    <Grid.Column
      key={cell.id}
      className={classNameStr}
      style={{
        width: `min(${Math.round(70/12)}vw, ${Math.round(70/12)}vh)`,
        height: `min(${Math.round(70/12)}vw, ${Math.round(70/12)}vh)`,
        padding: '0px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={() => onCellClick(cell)}
      disabled={!showAsLink}
    >
      <span style={{opacity: isOcean || isHarbour ? '0.1' : cellActivated || noneActivated ? '1' : '0.5'}}>{cell.cellType}</span>
    </Grid.Column>
  )
}
