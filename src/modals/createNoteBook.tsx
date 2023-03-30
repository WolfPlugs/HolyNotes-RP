import { components, common } from 'replugged'

import noteHandler from '../noteHandler'

const { Button, Modal: { ModalRoot, ModalHeader, ModalContent, ModalCloseButton, ModalFooter }, Text, TextInput } = components
const { React: { useState } } = common



export default (props) => {
  const [notebookName, setNotebookName] = useState('')
  return (
    <ModalRoot className='create-notebook' size='small'>
      <ModalHeader className='notebook-header'>
        <Text tag='h3'>Create Notebook</Text>
        <ModalCloseButton onClick={props.onClose} />
      </ModalHeader>
      <ModalContent>
        <Text>Notebook Name</Text>
        <TextInput
          value={notebookName}
          required={false}
          onChange={value => setNotebookName(value)}
          style={{ marginBottom: '10px' }}
        >
        </TextInput>
      </ModalContent>
      <ModalFooter>
        <Button
          onClick={() => {
            if (notebookName !== '')
              noteHandler.newNotebook(notebookName)
              props.onClose
          }}
          color={Button.Colors.GREEN}>
          Create Notebook
        </Button>
        <Button
          onClick={props.onClose}
          look={Button.Looks.LINK}
          color={Button.Colors.TRANSPARENT}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalRoot>
  )
}
