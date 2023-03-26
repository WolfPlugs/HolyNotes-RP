import { Injector, Logger, common, components, settings, webpack } from "replugged";

import Note from "./icons/Note";
import NoteButton from "./icons/NoteButton";
import NoteModal from "./modals/notebook";

const { React } = common;
const { openModal } = common.modal
const { Tooltip } = components;

const inject = new Injector();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = Logger.plugin("HolyNotes");
import { pluginSettings } from './noteHandler/settings'

export async function start(): Promise<void> {

  const mod = await webpack.waitForModule(webpack.filters.bySource('HEADER_BAR).AnalyticsLocationProvider'));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fnPropName = Object.entries(mod).find(([_, v]) => typeof v === "function")?.[0];

  const iconClasses = webpack.getByProps('iconWrapper', 'clickable');

  injectNotesPops()
  // @ts-ignore
  inject.after(mod, fnPropName, (args: any, res: any) => {
    const { toolbar } = args[0];
    // eslint-disable-next-line no-undefined
    if(toolbar.length === undefined) return res;
    toolbar.push(
      React.createElement(Tooltip, {
        text: "Holy Notes",
        position: "bottom",
      },
        React.createElement('div', {
          className: `note-button ${iconClasses.iconWrapper} ${iconClasses.clickable}`,
        }, React.createElement(NoteButton, {
          className: `note-button ${iconClasses.icon}`,
          onClick: () => {
            openModal(() => React.createElement(NoteModal))
          },
        }
        ))))

    return res
  });
}

export function stop(): void {
  inject.uninjectAll();
}

function injectNotesPops() {
  inject.utils.addPopoverButton(() => {
    return {
      label: "Add Notes",
      icon: NoteButton,
      onClick: () => {
        openModal(() => React.createElement())
      }
    }
  })
}
