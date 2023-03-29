import { common, components, webpack } from "replugged";

const { Modal, Flex, Divider, ErrorBoundary, TextInput, Text } = components;
const {
  React,
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

const NoteBookRender = ({
  notes,
  notebook,
  updateParent,
  sortDirection,
  sortType,
  searchInput,
}) => {
  if (Object.keys(notes).length === 0) {
    return <NoResultsMessage error={false} />;
  } else {
    let messageArray;
    sortType
      ? (messageArray = Object.keys(notes).map((note) => (
          <RenderMessage
            note={notes[note]}
            notebook={notebook}
            updateParent={updateParent}
            fromDeleteModal={false}
            closeModal={closeModal}
          />
        )))
      : (messageArray = Object.keys(notes)
          .map((note) => (
            <RenderMessage
              note={notes[note]}
              notebook={notebook}
              updateParent={updateParent}
              fromDeleteModal={false}
              closeModal={closeModal}
            />
          ))
          .sort((a, b) => new Date(b.props.note.timestamp) - new Date(a.props.note.timestamp)));

    if (!sortDirection) messageArray.reverse();

    if (searchInput && searchInput !== "")
      messageArray = messageArray.filter((message) =>
        message.props.note.content.toLowerCase().includes(searchInput.toLowerCase()),
      );

    return messageArray;
  }
};

export const NoteModal = (props) => {
  const [sortType, setSortType] = React.useState(true);
  const [searchInput, setSearch] = React.useState("");
  const [sortDirection, setSortDirection] = React.useState(true);
  const [currentNotebook, setCurrentNotebook] = React.useState("Main");

  const forceUpdate = React.useReducer(() => ({}), {})[1];
  const notes = noteHandlers.getNotes(false, currentNotebook);
  if (!notes) return <></>;
  return (
    <Modal.ModalRoot {...props} className="notebook" size="large" style={{ borderRadius: "8px" }}>
      <Modal.ModalHeader className="notebook-header-main">
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
        <Modal.ModalCloseButton onClick={props.onClose} />
      </Modal.ModalHeader>
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
      <Modal.ModalContent style={{ marginTop: "20px" }}>
        <ErrorBoundary>
          <NoteBookRender
            notes={notes}
            notebook={currentNotebook}
            updateParent={() => forceUpdate()}
            sortDirection={sortDirection}
            sortType={sortType}
            searchInput={searchInput}
          />
        </ErrorBoundary>
      </Modal.ModalContent>
    </Modal.ModalRoot>
  );
};
