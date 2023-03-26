import { components, common } from 'replugged'

const { ModalHeader, ModalCloseButton, ModalContent, ModalFooter, ModalRoot } = components.Modal
const { closeModal } = common.modal
const { FormItem, Slider, Button } = components

const NotesHandler = new (require('../noteHandler/index'))()

module.exports = () => {
  return (
    <ModalRoot className='help-modal' size='medium'>
      <ModalHeader>
        <FormItem tag='h3'>Help Modal</FormItem>
        <ModalCloseButton onClick={closeModal} />
      </ModalHeader>
      <ModalContent>
        <Slider fade={true}>
          <div className='help-markdown'>
            <h4>Adding Notes</h4>
            <p>To add a note right click on a message then hover over the "Note Message" item and click the button with the notebook name you would like to note the message to.</p>
            <br />
            <p>Protip: Clicking the "Note Message" button by itself will note to Main by default!</p>
            <hr />
            <h4>Deleting Notes</h4>
            <p>Note you can either right click the note and hit "Delete Note" or you can hold the 'DELETE' key on your keyboard and click on a note; it's like magic!</p>
            <hr />
            <h4>Moving Notes</h4>
            <p>To move a note right click on a note and hover over the "Move Note" item and click on the button corrosponding to the notebook you would like to move the note to.</p>
            <hr />
            <h4>Jump to Message</h4>
            <p>To jump to the location that the note was originally located at just right click on the note and hit "Jump to Message".</p>
          </div>
        </Slider>
      </ModalContent>
      <ModalFooter>
        <Button
          look={Button.Looks.LINK}
          color={Button.Colors.TRANSPARENT}
          onClick={closeModal}>
          Cancel
        </Button>
        <div className='notebook-display-left'>
          <Button
            look={Button.Looks.GHOST}
            color={Button.Colors.GREEN}
            onClick={() => {
              NotesHandler.refreshAvatars()
              closeModal
            }}>
            Refresh Avatars
          </Button>
        </div>
      </ModalFooter>
    </ModalRoot>
      )
} 
