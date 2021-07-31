import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Cell.module.css'
import * as poissonProcess from 'poisson-process'
import { yieldResourceAsync } from '../cell/cellSlice'
import { Card, Statistic, ArrowUpOutlined, Button } from 'antd'

export function CellDetails (props) {
  const {
    showAsLink,
    cellActivated,
    canActivate,
    allActivated,
    isHarbour,
    cell,
    onCellClick,
    dragging,
    setDragging
  } = props

  const dispatch = useDispatch()

  return (
    <Card>
      <Statistic
        title='Active'
        value={11.28}
        precision={2}
        valueStyle={{ color: '#3f8600' }}
        prefix={<ArrowUpOutlined />}
        suffix='%'
      />
    </Card>
  )
}
