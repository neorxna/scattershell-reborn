import { Label, Segment } from 'semantic-ui-react'
import { useNotes } from './useNotes'
import { isMobile } from 'react-device-detect'

const styles = {
  segmentGroup: {
    position: 'relative',
    top: '5vh',
    marginLeft: '10vw',
    marginRight: '10vw',
    backgroundColor: 'white',
    maxWidth: '320px'
  }
}

export function Notes ({ islandId }) {
  const { messages, notes } = useNotes(islandId)

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

  return notes.length === 0 ? (
    <Segment raised className='messages' style={styles.segmentGroup}>
      {messagesView}
    </Segment>
  ) : (
    <Segment.Group raised className='messages' style={styles.segmentGroup}>
      <Segment basic attached>
        {messagesView}
      </Segment>
      <Segment basic attached>
        {notesView}
      </Segment>
    </Segment.Group>
  )
}
