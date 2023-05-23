import { components, common } from "replugged";
import noteHandler from "../../noteHandler";

const {
  Button,
  Modal: { ModalRoot, ModalHeader, ModalContent, ModalCloseButton, ModalFooter },
  Text,
  TextInput,
} = components;

const { React } = common;

export default (props: Replugged.Components.ModalRootProps & { onClose: () => void }) => {
  const [notebookName, setNotebookName] = React.useState("");

  const handleCreateNotebook = React.useCallback(() => {
    if (notebookName !== "") noteHandler.newNotebook(notebookName);
    props.onClose();
  }, [notebookName]);

  return (
    <ModalRoot className="create-notebook" size="small" {...props}>
      <ModalHeader className="notebook-header">
        <Text tag="h3">Create Notebook</Text>
        <ModalCloseButton onClick={props.onClose} />
      </ModalHeader>
      <ModalContent>
        <TextInput
          value={notebookName}
          placeholder="Notebook Name"
          onChange={(value) => setNotebookName(value)}
          style={{ marginBottom: "10px" }}
        />
      </ModalContent>
      <ModalFooter>
        <Button onClick={handleCreateNotebook} color={Button.Colors.GREEN}>
          Create Notebook
        </Button>
      </ModalFooter>
    </ModalRoot>
  );
};
