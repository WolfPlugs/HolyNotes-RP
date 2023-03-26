import { common, components } from 'replugged';

const { Modal, Flex, Divider, FormItem, Slider } = components
const { React } = common
const { openModal, closeModal } = common.modal

const HelpModal = require('../modals/helpModal')
const HelpIcon = require('../icons/helpIcon')
const noteHandlers = new (require('../noteHandler'))()

const noteBookRender = ({ notes, notebook, updateParent, sortDirection, sortType, searchInput }) => {
  console.log('this right now')
  if(Object.keys(notes).length === 0) {
    return <div className='notebook-empty'>No notes found</div>
  } else {
    let messageArray 
    // sortType ? 
    //   messageArray = Object.keys(notes).map(note => 
    //     <)
  }
}

// eslint-disable-next-line require-await
export const NoteModal = async () => {
  const [sortType, setSortType] = React.useState(true)
  const [searchInput, setSearchInput] = React.useState('')
  const [sortDirection, setSortDirection] = React.useState(true)
  const [currentNotebook, setCurrentNotebook] = React.useState('Main')

  const forecUpdate = React.useReducer(() => ({}), {})[1]
  const notes = await noteHandlers.getNotes()
  if(!notes) return <></>
  return (
    <Modal.ModalRoot className='notebook' size='large' style={{ borderRadius: '8px' }}>
      <Flex className={`notebook-flex`} direction={Flex.Direction.VERTICAL} style={{ width: '100%' }}>
        <Divider>
          <Modal.ModalHeader className={`notebook-header-main`}>
            <FormItem tag='h4' className='notebook-heading'>
              NOTEBOOK
            </FormItem>
            <HelpIcon
              className='help-icon' name='HelpCircle'
              onClick={() => openModal(() => <HelpModal />)} />
            {/* <SearchBar
              className={'notebook-search'}
              size={SearchBar.Sizes.MEDIUM}
              autofocus={false}
              placeholder='Search'
              onQueryChange={query => setSearchInput(query)}
              onClear={() => setSearchInput('')}
              query={searchInput} /> */}
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
        <Slider fade={true}>
						<noteBookRender
							notes={notes}
							// notebook={currentNotebook}
							// updateParent={() => forceUpdate(u => ~u)}
							// sortDirection={sortDirection}
							// sortType={sortType}
							// searchInput={searchInput}
               />
					</Slider>
        </Modal.ModalContent>
      </Flex>
    </Modal.ModalRoot>
  )
}

