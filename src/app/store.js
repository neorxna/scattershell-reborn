import { configureStore } from '@reduxjs/toolkit'

import islandReducer from '../features/island/islandSlice'
import cellReducer from '../features/cell/cellSlice'

export default configureStore({
  reducer: {
    island: islandReducer,
    cell: cellReducer
  }
})
