import { components, webpack } from "replugged";
import noteHandler from "../../noteHandler";

const { ModalHeader, ModalCloseButton, ModalContent, ModalFooter, ModalRoot } = components.Modal;
const { Button, FormText, Text } = components;

const { colorStatusGreen } = await webpack.waitForModule<{
  colorStatusGreen: string;
}>(webpack.filters.byProps("colorStatusGreen"));

export default ({
  onClose,
  ...modalProps
}: Replugged.Components.ModalRootProps & { onClose: () => void }) => {
  return (
    <ModalRoot {...modalProps} className="help-modal" size="medium">
      <ModalHeader className="notebook-header">
        <Text tag="h3">Help Modal</Text>
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>
      <ModalContent>
        <div className="help-markdown">
          <Text>Adding Notes</Text>
          <FormText.DESCRIPTION>
            To add a note right click on a message then hover over the "Note Message" item and click
            <br />
            the button with the notebook name you would like to note the message to.
            <br />
            <span style={{ fontWeight: "bold" }} className={colorStatusGreen}>
              Protip:
            </span>{" "}
            Clicking the "Note Message" button by itself will note to Main by default!
          </FormText.DESCRIPTION>
          <hr />
          <Text>Deleting Notes</Text>
          <FormText.DESCRIPTION>
            Note you can either right click the note and hit "Delete Note" or you can hold the
            'DELETE' key on your keyboard and click on a note; it's like magic!
          </FormText.DESCRIPTION>
          <hr />
          <Text>Moving Notes</Text>
          <FormText.DESCRIPTION>
            To move a note right click on a note and hover over the "Move Note" item and click on
            the button corresponding to the notebook you would like to move the note to.
          </FormText.DESCRIPTION>
          <hr />
          <Text>Jump to Message</Text>
          <FormText.DESCRIPTION>
            To jump to the location that the note was originally located at just right click on the
            note and hit "Jump to Message".
          </FormText.DESCRIPTION>
        </div>
      </ModalContent>
      <ModalFooter>
        <div className="notebook-display-left">
          <Button
            look={Button.Looks.FILLED}
            color={Button.Colors.GREEN}
            onClick={() => {
              noteHandler.refreshAvatars();
            }}>
            Refresh Avatars
          </Button>
        </div>
      </ModalFooter>
    </ModalRoot>
  );
};
