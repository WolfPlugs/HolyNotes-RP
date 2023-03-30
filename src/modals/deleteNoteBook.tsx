import { components } from "replugged";

import noteHandler from "../noteHandler";

import NoResultsMessage from "../modals/noResultsMessage";
import RenderMessage from "../modals/renderMessage";

const {
  Button,
  Modal: { ModalRoot, ModalHeader, ModalContent, ModalCloseButton, ModalFooter },
  Text,
  ErrorBoundary,
} = components;




export default ({ onClose, notebook, ...props }) => {
	const notes = noteHandler.getNotes(false, notebook)


	return (
		<ModalRoot className='delete-notebook' size='LARGE' {...props}>
			<ModalHeader>
				<Text tag='h3'>Confirm Deletion</Text>
				<ModalCloseButton onClick={onClose} />
			</ModalHeader>
			<ModalContent>
				<ErrorBoundary>
					{Object.keys(notes).length === 0 || !notes
						? <NoResultsMessage error={false} />
						: Object.keys(notes).map(note =>
							<RenderMessage
								note={notes[note]}
								notebook={notebook}
								fromDeleteModal={true}
							/>
						)}
				</ErrorBoundary>
			</ModalContent>
			<ModalFooter>
				<Button
					onClick={() => {
						noteHandler.deleteNotebook(props.notebook)
						onClose()
					}}
					color={Button.Colors.RED}>
					Delete
				</Button>
			</ModalFooter>
		</ModalRoot>
	)
}
