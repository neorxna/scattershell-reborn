import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { IslandMap } from '../island/IslandMap'
import { generateGrid } from '../cell/cellSlice'

export function IslandGame ({islandId}) {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(generateGrid({ islandId }))
  }, [])

  return (
      <IslandMap islandId={islandId} />
  )
}
