import { components, common } from "replugged";

import noteHandler from "../noteHandler";

const {
  Button,
  Modal: { ModalRoot, ModalHeader, ModalContent, ModalCloseButton, ModalFooter },
  Text,
  TextInput,
} = components;
const {
  React: { useState },
} = common;

interface CreateNotebookModalProps {
  onClose: () => void;
}

export default (props: CreateNotebookModalProps) => {
  const [notebookName, setNotebookName] = useState("");

  const handleCreateNotebook = () => {
    if (notebookName !== "") {
      noteHandler.newNotebook(notebookName);
    }
    props.onClose();
  };

  return (
    <ModalRoot className="create-notebook" size="small" {...props}>
      <ModalHeader className="notebook-header">
        <Text tag="h3">Create Notebook</Text>
        <ModalCloseButton onClick={props.onClose} />
      </ModalHeader>
      <ModalContent>
        <TextInput
          value={notebookName}
          required={false}
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
