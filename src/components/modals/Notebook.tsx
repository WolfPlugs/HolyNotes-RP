import { common, components, webpack } from "replugged";

import HelpModal from "./HelpModal";
import HelpIcon from "../icons/HelpIcon";
import Errors from "./Errors";
import RenderMessage from "./RenderMessage";
import ManageNotebookButton from "./ManageNotebookButton";
import noteHandler from "../../noteHandler";

const {
  Modal: { ModalRoot, ModalHeader, ModalContent, ModalFooter, ModalCloseButton },
  ErrorBoundary,
  TextInput,
  Text,
  Flex,
  ContextMenu,
} = components;

const {
  React,
  modal: { openModal },
  contextMenu,
} = common;

const { quickSelect, quickSelectLabel, quickSelectQuick, quickSelectValue, quickSelectArrow } =
  await webpack.waitForModule<{
    quickSelect: string;
    quickSelectLabel: string;
    quickSelectQuick: string;
    quickSelectValue: string;
    quickSelectArrow: string;
  }>(webpack.filters.byProps("quickSelect"));

const TabBar = webpack.getExportsForProps(
  await webpack.waitForModule(webpack.filters.bySource('[role="tab"][aria-disabled="false"]')),
  ["Header", "Item", "Panel", "Separator"],
) as unknown as Discord.TabBar;

const renderNotebook = ({
  notes,
  notebook,
  updateParent,
  sortDirection,
  sortType,
  searchInput,
  closeModal,
}: Replugged.Components.ModalRootProps & {
  notes: Record<string, HolyNotes.Note>;
  notebook: string;
  updateParent: () => void;
  sortDirection: boolean;
  sortType: boolean;
  searchInput: string;
  closeModal: () => void;
}): JSX.Element | JSX.Element[] => {
  const messageArray = Object.values(notes).map((note) => (
    <RenderMessage
      note={note}
      notebook={notebook}
      updateParent={updateParent}
      fromDeleteModal={false}
      closeModal={closeModal}
    />
  ));

  if (sortType)
    messageArray.sort(
      (a, b) =>
        new Date(b.props.note?.timestamp)?.getTime() - new Date(a.props.note?.timestamp)?.getTime(),
    );

  if (sortDirection) messageArray.reverse();

  const filteredMessages = messageArray.filter((message) =>
    message.props.note.content.toLowerCase().includes(searchInput.toLowerCase()),
  );

  return filteredMessages.length > 0 ? filteredMessages : <Errors />;
};

export const NoteModal = (props: Replugged.Components.ModalRootProps & { onClose: () => void }) => {
  const [sortType, setSortType] = React.useState(true);
  const [searchInput, setSearch] = React.useState("");
  const [sortDirection, setSortDirection] = React.useState(true);
  const [currentNotebook, setCurrentNotebook] = React.useState("Main");

  const forceUpdate = React.useReducer(() => ({}), {})[1];
  const notes = noteHandler.getNotes(currentNotebook);

  if (!notes) return <></>;

  return (
    <ModalRoot {...props} className="notebook" size="large" style={{ borderRadius: "8px" }}>
      <Flex className="notebook-flex" direction={Flex.Direction.VERTICAL} style={{ width: "100%" }}>
        <div className={`notebook-topSection`}>
          <ModalHeader className={`notebook-header-main`}>
            <Text
              variant="heading-lg/semibold"
              style={{ flexGrow: 1 }}
              className={`notebook-heading`}>
              NOTEBOOK
            </Text>
            <div className="notebook-flex help-icon" onClick={() => openModal(HelpModal)}>
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
          <div className={`notebook-tabbar-Container`}>
            <TabBar
              type="top"
              look="brand"
              className={`notebook-tabbar-Bar notebook-tabbar`}
              selectedItem={currentNotebook}
              onItemSelect={setCurrentNotebook}>
              {Object.keys(noteHandler.getAllNotes()).map((notebook) => (
                <TabBar.Item
                  id={notebook}
                  className={`notebook-tabbar-barItem notebook-tabbar-item`}
                  key={notebook}>
                  {notebook}
                </TabBar.Item>
              ))}
            </TabBar>
          </div>
        </div>
        <ModalContent style={{ marginTop: "20px" }}>
          <ErrorBoundary>
            {renderNotebook({
              notes,
              notebook: currentNotebook,
              updateParent: () => forceUpdate(),
              sortDirection: sortDirection,
              sortType: sortType,
              searchInput: searchInput,
              closeModal: props.onClose,
            })}
          </ErrorBoundary>
        </ModalContent>
      </Flex>
      <ModalFooter>
        <ManageNotebookButton notebook={currentNotebook} setNotebook={setCurrentNotebook} />
        <div className="sort-button-container notebook-display-left">
          <Flex
            align={Flex.Align.CENTER}
            className={quickSelect}
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
              // @ts-ignore
              contextMenu.open(event, () => (
                <ContextMenu.ContextMenu onClose={contextMenu.close} navId="holynotes_sort">
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
            <Text className={quickSelectLabel}>Change Sorting:</Text>
            <Flex grow={0} align={Flex.Align.CENTER} className={quickSelectQuick}>
              <Text className={quickSelectValue}>
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
