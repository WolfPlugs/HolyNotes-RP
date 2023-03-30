import { common, components, webpack } from "replugged";

const { Modal: {
  ModalRoot,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
}, ErrorBoundary, TextInput, Text, Button } = components;
const {
  React: { useState, useReducer },
  modal: { openModal, closeModal },
} = common;

const { tabBarContainer, tabBar, tabBarItem } = webpack.getByProps("tabBarContainer");

const TabBar = webpack.getExportsForProps(
  webpack.getBySource('[role="tab"][aria-disabled="false"]'),
  ["Header", "Item", "Panel", "Separator"],
);

import HelpModal from "../modals/helpModal";
import HelpIcon from "../icons/helpIcon";
import noteHandlers from "../noteHandler/index";
import NoResultsMessage from "./noResultsMessage";
import RenderMessage from "./renderMessage";
import NotebookManagementButton from "./notebookManagementButton";

const NoteBookRender = ({
  notes,
  notebook,
  updateParent,
  sortDirection,
  sortType,
  searchInput,
  closeModal,
}) => {
  const messageArray = Object.keys(notes).map((note) => (
    <RenderMessage
      note={notes[note]}
      notebook={notebook}
      updateParent={updateParent}
      fromDeleteModal={false}
      closeModal={closeModal}
    />
  ));

  if (sortType) {
    messageArray.sort((a, b) =>
      new Date(b.props.note.timestamp) - new Date(a.props.note.timestamp)
    );
  }

  if (sortDirection) {
    messageArray.reverse();
  }

  const filteredMessages = messageArray.filter((message) =>
    message.props.note.content.toLowerCase().includes(searchInput.toLowerCase())
  );

  return filteredMessages.length > 0 ? (
    filteredMessages
  ) : (
    <NoResultsMessage error={false} />
  );
};

export const NoteModal = (props) => {
  const [sortType, setSortType] = useState(true);
  const [searchInput, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState(true);
  const [currentNotebook, setCurrentNotebook] = useState("Main");

  const forceUpdate = useReducer(() => ({}), {})[1];
  const notes = noteHandlers.getNotes(false, currentNotebook);

  if (!notes) return <></>;
  return (
    <ModalRoot {...props} className="notebook" size="large" style={{ borderRadius: "8px" }}>
      <ModalHeader className="notebook-header-main">
        <Text variant="heading-lg/semibold" style={{ flexGrow: 1 }} className="notebook-heading">
          NOTEBOOK
        </Text>
        <div onClick={() => openModal(HelpModal)}>
          <HelpIcon className="help-icon" name="HelpCircle" />
        </div>
        <div style={{ marginBottom: "20px" }} className="notebook-search">
          <TextInput
            autofocus={false}
            placeholder="Search for a message..."
            onChange={(e) => setSearch(e)}
          />
        </div>
        <ModalCloseButton onClick={props.onClose} />
      </ModalHeader>
      <div className={`${tabBarContainer}`}>
        <TabBar
          type="top"
          look="brand"
          className={`${tabBar} notebook-tabbar`}
          selectedItem={currentNotebook}
          onItemSelect={setCurrentNotebook}>
          {Object.keys(noteHandlers.getNotes(true)).map((notebook) => (
            <TabBar.Item
              id={notebook}
              className={`${tabBarItem} notebook-tabbar-item`}
              key={notebook}>
              {notebook}
            </TabBar.Item>
          ))}
        </TabBar>
      </div>
      <ModalContent style={{ marginTop: "20px" }}>
        <ErrorBoundary>
          <NoteBookRender
            notes={notes}
            notebook={currentNotebook}
            updateParent={() => forceUpdate()}
            sortDirection={sortDirection}
            sortType={sortType}
            searchInput={searchInput}
            closeModal={props.onClose}
          />
        </ErrorBoundary>
      </ModalContent>
      <ModalFooter>
        <NotebookManagementButton
          notebook={currentNotebook}
          setNotebook={setCurrentNotebook} />
        <Button
          color={Button.Colors.TRANSPARENT}
          look={Button.Looks.LINK}
          onClick={props.onClose}
          style={{ paddingLeft: '5px', paddingRight: '10px' }}
        >
          Cancel
        </Button>
      </ModalFooter>
    </ModalRoot>
  );
};
