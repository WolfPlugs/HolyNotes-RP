import { components, common } from "replugged";

import NotebookCreateModal from "./NotebookCreateModal";
import NotebookDeleteModal from "./NotebookDeleteModal";

const { Button } = components;
const {
  modal: { openModal },
} = common;

export default ({
  notebook,
}: {
  notebook: string;
  setNotebook: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element => {
  const isNotMain = notebook !== "Main";

  return (
    <Button
      color={isNotMain ? Button.Colors.RED : Button.Colors.GREEN}
      onClick={
        isNotMain
          ? () => openModal((props) => <NotebookDeleteModal {...props} notebook={notebook} />)
          : () => openModal((props) => <NotebookCreateModal {...props} />)
      }>
      {isNotMain ? "Delete Notebook" : "Create Notebook"}
    </Button>
  );
};
