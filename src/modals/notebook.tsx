import { common, components, webpack } from "replugged";

const { Modal, Flex, Divider, ErrorBoundary, TextInput, Text } = components;
const { React } = common;
const { openModal, closeModal } = common.modal;

const { tabBarContainer } = webpack.getByProps("tabBarContainer");

import HelpModal from "../modals/helpModal";
import HelpIcon from "../icons/helpIcon";
import noteHandlers from "../noteHandler/index";
import noResultsMessage from "./noResultsMessage";

const noteBookRender = ({
  notes,
  notebook,
  updateParent,
  sortDirection,
  sortType,
  searchInput,
}) => {
  console.log("this right now");
  if (Object.keys(notes).length === 0) {
    return <noResultsMessage error={false} />;
  } else {
    let messageArray;
    // sortType ?
    //   messageArray = Object.keys(notes).map(note =>
    //     <)
  }
};

export const NoteModal = (props) => {
  const [searchInput, setSearch] = React.useState("");
  const [currentNotebook, setCurrentNotebook] = React.useState("Main");
  const notes = noteHandlers.getNotes()[currentNotebook];
  if (!notes) return <></>;
  return (
    <Modal.ModalRoot {...props} className="notebook" size="large" style={{ borderRadius: "8px" }}>
      <Modal.ModalHeader>
        <Text variant="heading-lg/semibold" style={{ flexGrow: 1 }}>
          NOTEBOOK
        </Text>
        <div onClick={() => openModal(HelpModal)}>
          <HelpIcon className="help-icon" name="HelpCircle" />
        </div>
        <div style={{ marginBottom: "20px" }} className='notebook-search' >
          <TextInput
            autofocus={false}
            placeholder="Search for a message..."
            onChange={(e) => setSearch(e)}
          />
        </div>
        <Modal.ModalCloseButton onClick={props.onClose} />
      </Modal.ModalHeader>
      <Modal.ModalContent style={{ marginTop: "20px" }}>
        <ErrorBoundary>
          <div>gg
          <Flex fade={true}>
            <noteBookRender
              notes={notes}
            // notebook={currentNotebook}
            // updateParent={() => forceUpdate(u => ~u)}
            // sortDirection={sortDirection}
            // sortType={sortType}
            // searchInput={searchInput}
            />
          </Flex>
          </div>
        </ErrorBoundary>
      </Modal.ModalContent>
    </Modal.ModalRoot>
  );
};
