import { Injector, common, components, types, webpack } from "replugged";
import type { Channel, Message } from "discord-types/general";

import NoteButton, { Popover as NoteButtonPopover } from "./components/icons/NoteButton";
import noteHandler from "./noteHandler";
import { NoteModal } from "./components/modals/Notebook";

import "./style.css";

const { openModal } = common.modal;
const {
  Tooltip,
  ContextMenu: { MenuItem },
} = components;

const inject = new Injector();

export const customExports: Record<string, types.ModuleExports | types.AnyFunction> = {};
export const addCustomExport = (
  name: string,
  expo: types.ModuleExports | types.AnyFunction,
): void => {
  customExports[name] = expo;
};

type ChannelHeaderModule = Record<string, (channelHeader: Discord.ChannelHeader) => JSX.Element>;

export const injectChannelHeader = async (mod: ChannelHeaderModule): Promise<void> => {
  const iconClasses = await webpack.waitForModule<{
    icon: string;
    iconWrapper: string;
    clickable: string;
  }>(webpack.filters.byProps("iconWrapper", "clickable"));

  // @ts-expect-error - Replugged Types Broke
  inject.utils.addPopoverButton((message: Message, channel: Channel) => {
    return {
      label: "Add Message to Notes",
      icon: NoteButtonPopover,
      onClick: () => noteHandler.addNote(channel, message, "Main"),
    };
  });

  // @ts-expect-error - Replugged Types Broke
  inject.utils.addMenuItem(types.ContextMenuTypes.Message, (data) => {
    return {
      type: MenuItem,
      label: "Add Message to",
      children: Object.keys(noteHandler.getAllNotes()).map((notebook: string) => {
        return {
          type: MenuItem,
          label: notebook,
          id: notebook,
          action: () =>
            noteHandler.addNote(data.channel as Channel, data.message as Message, notebook),
        };
      }),
    };
  });

  inject.after(
    mod,
    "default",
    /* Only using first member so only typing first member */
    (args: [Discord.ChannelHeader, ...unknown[]], res: JSX.Element) => {
      /* Catching just in case */
      if (args?.[0]) {
        const { toolbar } = args[0];

        if (toolbar && toolbar?.length)
          toolbar.push(
            <Tooltip text={"Holy Notes"} position={"bottom"}>
              <div className={`note-button ${iconClasses.iconWrapper} ${iconClasses.clickable}`}>
                <NoteButton
                  className={`note-button ${iconClasses.icon}`}
                  onClick={() => openModal((props) => <NoteModal {...props} />)}
                />
              </div>
            </Tooltip>,
          );
      }

      return res;
    },
  );
};

export const start = async (): Promise<void> =>
  await injectChannelHeader(
    await webpack.waitForModule<ChannelHeaderModule>(
      webpack.filters.bySource("default.HEADER_BAR)"),
    ),
  );

export const stop = (): void => inject.uninjectAll();
