import React from 'react'
import { IslandGame } from './features/game/IslandGame'
import { Notes } from './features/notes/Notes'
import './App.less'

const styles = {
  container: {
    paddingTop:'5vh',
    paddingBottom:'5vh',
    height:'100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'start',
  },
  notesContainer: {
  },
  islandGameContainer: {
    aspectRatio: '1/1',
    maxWidth: '320px'
  }
}

function App () {
  const islandId = 'harvfn'

  return (
    <div style={styles.container}>
      <div style={styles.islandGameContainer}>
        <IslandGame islandId={islandId} />
      </div>
      <div style={styles.notesContainer}>
        <Notes islandId={islandId} />
      </div>
    </div>
  )
}

export default App

/* 

When an island is discovered..
 
* Create cells for the island according to pattern
 ( initialise resources, etc.)
* Associate the new cells with the island
* Show the island builder

  When all cells have been assigned and user has confirmed,
  * Mark the island as active (picked up by game loop)
  * 

 */
