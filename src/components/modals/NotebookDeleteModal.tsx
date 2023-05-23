import { components } from "replugged";

import noteHandler from "../../noteHandler";
import Errors from "./Errors";
import RenderMessage from "./RenderMessage";

const {
  Button,
  Modal: { ModalRoot, ModalHeader, ModalContent, ModalCloseButton, ModalFooter },
  Text,
  ErrorBoundary,
} = components;

export default ({
  onClose,
  notebook,
  ...props
}: Replugged.Components.ModalRootProps & { onClose: () => void; notebook: string }) => {
  const notes = noteHandler.getNotes(notebook);

  if (!notes) return <></>;

  return (
    <ModalRoot className="delete-notebook" size="large" {...props}>
      <ModalHeader>
        <Text tag="h3">Confirm Deletion</Text>
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>
      <ModalContent>
        <ErrorBoundary>
          {Object.keys(notes).length === 0 || !notes ? (
            <Errors />
          ) : (
            Object.values(notes).map((note) => (
              <RenderMessage note={note} notebook={notebook} fromDeleteModal={true} />
            ))
          )}
        </ErrorBoundary>
      </ModalContent>
      <ModalFooter>
        <Button
          onClick={() => {
            noteHandler.deleteNotebook(notebook);
            onClose();
          }}
          color={Button.Colors.RED}>
          Delete
        </Button>
      </ModalFooter>
    </ModalRoot>
  );
};
