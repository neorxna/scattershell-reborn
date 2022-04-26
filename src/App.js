import React from 'react'
import { IslandGame } from './features/game/IslandGame'
import { Notes } from './features/notes/Notes'
import './App.less'
import { Grid } from 'semantic-ui-react'

const styles = {
  container: {
    paddingTop: '5vh',
    paddingBottom: '5vh',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'start'
  },
  notesContainer: {},
  islandGameContainer: {
    aspectRatio: '1/1'
  }
}

function App () {
  const islandId = 'harvfn'

  return (
    <div style={{ width: '100%', height: '100%', padding: '1em' }}>
      <Grid columns={2} stackable>
        <Grid.Column style={{ display: 'flex', justifyContent: 'center' }}>
          <IslandGame islandId={islandId} />
        </Grid.Column>
        <Grid.Column style={{ display: 'flex', justifyContent: 'center' }}>
          <Notes islandId={islandId} />
        </Grid.Column>
      </Grid>
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
