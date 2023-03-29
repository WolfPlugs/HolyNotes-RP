
import { Injector, Logger, common, components, webpack } from "replugged";

import NoteButton from "./icons/NoteButton";
import { NoteModal } from "./modals/notebook";

import "./style.css"; 
import noteHandler from "./noteHandler";

const { openModal } = common.modal;
const { Tooltip } = components;

const inject = new Injector();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = Logger.plugin("HolyNotes");

export async function start(): Promise<void> {
  
  const mod = await webpack.waitForModule(
    webpack.filters.bySource("HEADER_BAR).AnalyticsLocationProvider"),
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fnPropName = Object.entries(mod).find(([_, v]) => typeof v === "function")?.[0];

  const iconClasses = webpack.getByProps("iconWrapper", "clickable");

  injectNotesPops();

  // @ts-ignore
  inject.after(mod, fnPropName, (args: any, res: any) => {
    const { toolbar } = args[0];
    // eslint-disable-next-line no-undefined
    if (toolbar.length === undefined) return res;
    toolbar.push(
      <Tooltip text={"Holy Notes"} position={"bottom"}>
        <div className={`note-button ${iconClasses.iconWrapper} ${iconClasses.clickable}`}>
          <NoteButton
            className={`note-button ${iconClasses.icon}`}
            onClick={() => {
              openModal((props) => <NoteModal {...props} />);
            }}
          />
        </div>
      </Tooltip>, 
    );

    return res;
  });
}

export function stop(): void {
  inject.uninjectAll();
}

function injectNotesPops() {
  inject.utils.addPopoverButton(() => {
    return {
      label: "Add Message to notes",
      icon: NoteButton,
      onClick: (e, a) => {
        noteHandler.addNote(e, a, "Main")
      },
    };
  });
}
