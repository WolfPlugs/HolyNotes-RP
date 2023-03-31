import { common, components, webpack } from "replugged";

const {
  Modal: { ModalRoot, ModalHeader, ModalContent, ModalFooter, ModalCloseButton },
  ErrorBoundary,
  TextInput,
  Text,
  Button,
  Flex,
  ContextMenu,
} = components;
const {
  React: { useState, useReducer },
  modal: { openModal, closeModal },
  contextMenu: { open, close },
} = common;

const { tabBarContainer, tabBar, tabBarItem, topSectionNormal } =
  webpack.getByProps("tabBarContainer");
const { header } = webpack.getByProps("header");
const { quickSelect, quickSelectLabel, quickSelectQuick, quickSelectValue, quickSelectArrow } =
  webpack.getByProps("quickSelect");

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
    messageArray.sort(
      // @ts-ignore
      (a, b) => new Date(b.props.note.timestamp) - new Date(a.props.note.timestamp),
    );
  }

  if (sortDirection) {
    messageArray.reverse();
  }

  const filteredMessages = messageArray.filter((message) =>
    message.props.note.content.toLowerCase().includes(searchInput.toLowerCase()),
  );

  return filteredMessages.length > 0 ? filteredMessages : <NoResultsMessage error={false} />;
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
      <Flex className="notebook-flex" direction={Flex.Direction.VERTICAL} style={{ width: "100%" }}>
        <div className={topSectionNormal}>
          <ModalHeader className={`notebook-header-main`}>
            <Text
              variant="heading-lg/semibold"
              style={{ flexGrow: 1 }}
              className={`notebook-heading`}>
              NOTEBOOK
            </Text>
            <div
              className="notebook-flex help-icon"
              name="HelpCircle"
              onClick={() => openModal(HelpModal)}>
              <HelpIcon />
            </div>
            <div style={{ marginBottom: "10px" }} className="notebook-search">
              <TextInput
                autoFocus={false}
                placeholder="Search for a message..."
                onChange={(e) => setSearch(e)}
              />
            </div>
            <ModalCloseButton onClick={props.onClose} />
          </ModalHeader>
          <div className={`${tabBarContainer}`}>
            {
              // @ts-ignore
              <TabBar
                type="top"
                look="brand"
                className={`${tabBar} notebook-tabbar`}
                selectedItem={currentNotebook}
                onItemSelect={setCurrentNotebook}>
                {Object.keys(noteHandlers.getNotes(true)).map((notebook) => (
                  // @ts-ignore
                  <TabBar.Item
                    id={notebook}
                    className={`${tabBarItem} notebook-tabbar-item`}
                    key={notebook}>
                    {notebook}
                  </TabBar.Item>
                ))}
              </TabBar>
            }
          </div>
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
      </Flex>
      <ModalFooter>
        <NotebookManagementButton notebook={currentNotebook} setNotebook={setCurrentNotebook} />
        <div className="sort-button-container notebook-display-left">
          <Flex
            align={Flex.Align.CENTER}
            className={quickSelect}
            onClick={(event) => {
              // @ts-ignore
              open(event, () => (
                <ContextMenu.ContextMenu onClose={close}>
                  <ContextMenu.MenuItem
                    label="Ascending / Date Added"
                    id="ada"
                    action={() => {
                      setSortDirection(true);
                      setSortType(true);
                    }}
                  />
                  <ContextMenu.MenuItem
                    label="Ascending / Message Date"
                    id="amd"
                    action={() => {
                      setSortDirection(true);
                      setSortType(false);
                    }}
                  />
                  <ContextMenu.MenuItem
                    label="Descending / Date Added"
                    id="dda"
                    action={() => {
                      setSortDirection(false);
                      setSortType(true);
                    }}
                  />
                  <ContextMenu.MenuItem
                    label="Descending / Message Date"
                    id="dmd"
                    action={() => {
                      setSortDirection(false);
                      setSortType(false);
                    }}
                  />
                </ContextMenu.ContextMenu>
              ));
            }}>
            <Text variant="body" className={quickSelectLabel}>
              Change Sorting:
            </Text>
            <Flex grow={0} align={Flex.Align.CENTER} className={quickSelectQuick}>
              <Text variant="body" className={quickSelectValue}>
                {sortDirection ? "Ascending" : "Descending"} /{" "}
                {sortType ? "Date Added" : "Message Date"}
              </Text>
              <div className={quickSelectArrow} />
            </Flex>
          </Flex>
        </div>
      </ModalFooter>
    </ModalRoot>
  );
};
