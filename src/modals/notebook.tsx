import { common, components, webpack } from "replugged";

const { Modal, Flex, Divider, FormItem, TextInput } = components;
const { React } = common;
const { openModal, closeModal } = common.modal;

const { tabBarContainer } = webpack.getByProps('tabBarContainer')


import HelpModal from "../modals/helpModal";
import HelpIcon from "../icons/helpIcon";
import noteHandlers from "../noteHandler/index";

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
    return <div className="notebook-empty">No notes found</div>;
  } else {
    let messageArray;
    // sortType ?
    //   messageArray = Object.keys(notes).map(note =>
    //     <)
  }
};

export const NoteModal = (props) => {
  const [searchInput, setSearch] = React.useState('');
  // const [currentNotebook, setCurrentNotebook] = React.useState('Main')
  const notes = noteHandlers.getNotes();
  if (!notes) return <></>;
  return (
    <Modal.ModalRoot {...props} className="notebook" size="large" style={{ borderRadius: "8px" }}>
      <Flex
        className={`notebook-flex`}
        direction='VERTICAL'
        style={{ width: "100%" }}>
        <Divider className={tabBarContainer}>
          <Modal.ModalHeader className={`notebook-header-main`}>
            <FormItem tag="h4" className="notebook-heading">
              NOTEBOOK
            </FormItem>
            <HelpIcon
              className="help-icon"
              name="HelpCircle"
              onClick={() => openModal(HelpModal)}
            />
            <div style={{ marginBottom: "10px" }}>
              <TextInput
                autofocus={false}
                placeholder='Search for a message...'
                onChange={(e) => setSearch(e)}
              />
            </div>
            <Modal.ModalCloseButton onClick={closeModal} />
          </Modal.ModalHeader>
          <Divider>
            {/* <TabBar
            className={`${Classes.TabBar.tabBar} notebook-tabbar`}
            selectedItem={currentNotebook}
            type={TabBar.Types.TOP}
            onItemSelect={setCurrentNotebook}>
            {Object.keys(NotesHandler.getNotes()).map(notebook =>
              <TabBar.Item id={notebook} className={`${Classes.TabBarItem.tabBarItem} notebook-tabbar-item`}>
                {notebook}
              </TabBar.Item>
            )}
          </TabBar> */}
          </Divider>
        </Divider>
        <Modal.ModalContent>
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
        </Modal.ModalContent>
      </Flex>
    </Modal.ModalRoot>
  );
};
