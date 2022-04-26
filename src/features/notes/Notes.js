import { useSelector } from 'react-redux'
import { Label, Segment } from 'semantic-ui-react'
import { useNotes } from './useNotes'
import { isMobile } from 'react-device-detect'
import { selectRemainingActivations } from '../cell/cellSlice'

const styles = {
  segmentGroup: {
    backgroundColor: 'white',
    maxWidth: '420px'
  }
}

export function Notes ({ islandId }) {
  const { messages, notes } = useNotes(islandId)
  const remainingActivations = useSelector(selectRemainingActivations(islandId))

  const messagesView = (
    <Label.Group size={isMobile ? 'small' : 'large'}>
      {messages.map(message => (
        <Label
          {...(message.includes('need ')
            ? { color: 'violet' }
            : { color: 'green' })}
          key={message}
        >
          {message}
        </Label>
      ))}
    </Label.Group>
  )

  const notesView = (
    <Label.Group size={isMobile ? 'tiny' : 'small'}>
      {notes.map(note => (
        <Label
          {...(note.includes('fishing') ? { color: 'teal' } : {})}
          key={note}
        >
          {note}
        </Label>
      ))}
    </Label.Group>
  )

  return <Segment.Group raised className='messages' style={styles.segmentGroup}>
      <Segment basic attached>
        {messagesView}
      </Segment>
      <Segment basic attached>
        {notesView}
        {remainingActivations === 0  ? <strong>island complete!</strong> : <><strong>{ remainingActivations }</strong> tiles remaining</>}
      </Segment>

    </Segment.Group>
  
}
