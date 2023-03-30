import { components, common } from 'replugged'

import CreateNoteBook from './createNoteBook'

const { Button } = components
const { modal: { openModal } } = common

// const DeleteNotebook = require('../modals/DeleteNotebook')

export default (props) => {
  const { notebook } = props

  if (notebook !== 'Main') {
		return <>
			<Button
				color={Button.Colors.RED}
				// onClick={() => openModal(() => <DeleteNotebook {...args} />)}
        >
				Delete Notebook
			</Button>
		</>
	} else {
		return <>
			<Button
				color={Button.Colors.GREEN}
				onClick={() => openModal((props) => <CreateNoteBook {...props}/>)}
        >
				Create Notebook
			</Button>
		</>
	}
}
