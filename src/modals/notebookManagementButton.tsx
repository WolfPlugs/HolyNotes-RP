import { components, common } from "replugged";

import CreateNoteBook from "./createNoteBook";
import DeleteNotebook from "./deleteNoteBook";

const { Button } = components;
const {
  modal: { openModal },
} = common;

export default (props) => {
  const { notebook } = props;
  if (notebook !== "Main") {
    return (
      <>
        <Button
          color={Button.Colors.RED}
          onClick={() => openModal((props) => <DeleteNotebook {...props} notebook={notebook} />)}>
          Delete Notebook
        </Button>
      </>
    );
  } else {
    return (
      <>
        <Button
          color={Button.Colors.GREEN}
          onClick={() => openModal((props) => <CreateNoteBook {...props} />)}>
          Create Notebook
        </Button>
      </>
    );
  }
};
