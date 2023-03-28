import { common, components, webpack } from "replugged";

const { Modal, Flex, Divider, ErrorBoundary, TextInput, Text } = components;
const { React, modal: { openModal, closeModal } } = common;

const { tabBarContainer } = webpack.getByProps("tabBarContainer");

import HelpModal from "../modals/helpModal";
import HelpIcon from "../icons/helpIcon";
import noteHandlers from "../noteHandler/index";
import noResultsMessage from "./noResultsMessage";
import renderMessage from "./renderMessage";

const NoteBookRender = ({
  notes,
  notebook,
  updateParent,
  sortDirection,
  sortType,
  searchInput,
}) => {
  if (Object.keys(notes).length === 0) {
    return <noResultsMessage error={false} />;
  } else {
    let messageArray;
    sortType ?
      messageArray = Object.keys(notes).map(note =>
        <renderMessage
          note={notes[note]}
          notebook={notebook}
          updateParent={updateParent}
          fromDeleteModal={false}
          closeModal={closeModal}
        />
      ) :
      messageArray = Object.keys(notes).map(note =>
        <renderMessage
          note={notes[note]}
          notebook={notebook}
          updateParent={updateParent}
          fromDeleteModal={false}
          closeModal={closeModal}
        />
      ).sort((a, b) => new Date(b.props.note.timestamp) - new Date(a.props.note.timestamp))

    if (!sortDirection) messageArray.reverse()

    if (searchInput && searchInput !== "") messageArray = messageArray.filter(message => message.props.note.content.toLowerCase().includes(searchInput.toLowerCase()))

    return messageArray;
  }
};

export const NoteModal = (props) => {
	const [sortType, setSortType] = React.useState(true)
	const [searchInput, setSearch] = React.useState('')
	const [sortDirection, setSortDirection] = React.useState(true)
	const [currentNotebook, setCurrentNotebook] = React.useState('Main')

  const forceUpdate = React.useReducer(() => ({}), {})[1];

  const notes = noteHandlers.getNotes();

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
              <NoteBookRender
                notes={notes}
                notebook={currentNotebook}
                updateParent={() => forceUpdate()}
                sortDirection={sortDirection}
                sortType={sortType}
                searchInput={searchInput}
              />
            </Flex>
          </div>
        </ErrorBoundary>
      </Modal.ModalContent>
    </Modal.ModalRoot>
  );
};
