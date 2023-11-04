/* eslint-disable no-use-before-define */
import { common, components, types, webpack } from "replugged";

import noteHandler from "../../noteHandler";

const { message, groupStart, cozyMessage } = await webpack.waitForModule<{
  message: string;
  groupStart: string;
  cozyMessage: string;
}>(webpack.filters.byProps("cozyMessage"));

const Moment = (await webpack.waitForModule(
  webpack.filters.bySource("parseTwoDigitYear"),
)) as unknown as Discord.MomentConstructor;

const User = webpack.getBySource("isClyde(){") as unknown as Discord.UserConstructor;
const Message = webpack.getBySource("isEdited(){") as unknown as Discord.MessageConstructor;
const Channel = webpack.getByProps("ChannelRecordBase").ChannelRecordBase as unknown as Discord.Channel;

const transitionTo = webpack.getFunctionBySource(
  await webpack.waitForModule<Record<string, types.AnyFunction>>(
    webpack.filters.bySource("transitionTo - Transitioning to "),
  ),
  "transitionTo - Transitioning to ",
) as unknown as (path: string) => void;

// replugged.webpack.getModule((m) => ["getGuildId"].every((p) => Object.values(m.exports).some((m) => m?.prototype?.[p]))).Sf

const {
  React,
  contextMenu: { open, close },
} = common;
const { ContextMenu } = components;

export default ({
  note,
  notebook,
  updateParent,
  fromDeleteModal,
  closeModal,
}: Replugged.Components.ModalRootProps & {
  note: HolyNotes.Note;
  notebook: string;
  updateParent?: () => void;
  fromDeleteModal: boolean;
  closeModal?: () => void;
}) => {
  const ChannelMessage = webpack.getByProps("ThreadStarterChatMessage").default

  const [isHoldingDelete, setHoldingDelete] = React.useState(false);

  React.useEffect(() => {
    const deleteHandler = (e: { key: string; type: string }) =>
      e.key.toLowerCase() === "delete" && setHoldingDelete(e.type.toLowerCase() === "keydown");

    document.addEventListener("keydown", deleteHandler);
    document.addEventListener("keyup", deleteHandler);

    return () => {
      document.removeEventListener("keydown", deleteHandler);
      document.removeEventListener("keyup", deleteHandler);
    };
  }, []);
  return (
    <div
      className="holy-note"
      style={{
        marginBottom: "8px",
        marginTop: "8px",
        paddingTop: "4px",
        paddingBottom: "4px",
      }}
      onClick={() => {
        if (isHoldingDelete && !fromDeleteModal) {
          noteHandler.deleteNote(note.id, notebook);
          updateParent?.();
        }
      }}
      onContextMenu={(event: any) => {
        if (!fromDeleteModal)
          //@ts-ignore
          return open(event, (props: any) => (
            //@ts-ignore
            <NoteContextMenu
              {...Object.assign({}, props, { onClose: close })}
              note={note}
              notebook={notebook}
              updateParent={updateParent}
              closeModal={closeModal}
            />
          ));
      }}>
      <ChannelMessage
        className={`holy-render ${message} ${groupStart} ${cozyMessage}`}
        key={note.id}
        groupId={note.id}
        id={note.id}
        compact={false}
        isHighlight={false}
        isLastItem={false}
        renderContentOnly={false}
        // @ts-ignore
        channel={new Channel({ id: "holy-notes" })}
        message={
          new Message(
            Object.assign(
              { ...note },
              {
                author: new User({ ...note.author }),
                timestamp: new Moment(new Date(note.timestamp)),
                embeds: note.embeds.map((embed: { timestamp: string | number | Date }) =>
                  embed.timestamp
                    ? Object.assign(embed, {
                      // @ts-ignore
                      timestamp: new Moment(new Date(embed.timestamp)),
                    })
                    : embed,
                ),
              },
            ),
          )
        }
      />
    </div>
  );
};

const NoteContextMenu = (
  props: Replugged.Components.ContextMenuProps & {
    updateParent?: () => void;
    notebook: string;
    note: HolyNotes.Note;
    closeModal?: () => void;
  },
) => {
  const { note, notebook, updateParent, closeModal } = props;

  return (
    <ContextMenu.ContextMenu {...props}>
      <ContextMenu.MenuItem
        label="Jump to message"
        id="jump"
        action={() => {
          transitionTo(`/channels/${note.guild_id ?? "@me"}/${note.channel_id}/${note.id}`);
          closeModal?.();
        }}
      />
      <ContextMenu.MenuItem
        label="Copy Text"
        id="copy-text"
        action={() => DiscordNative.clipboard.copy(note.content)}
      />
      {note?.attachments.length ? (
        <ContextMenu.MenuItem
          label="Copy Attachment URL"
          id="copy-url"
          action={() => DiscordNative.clipboard.copy(note?.attachments[0].url)}
        />
      ) : null}
      <ContextMenu.MenuItem
        color="danger"
        label="Delete Note"
        id="delete-note"
        action={() => {
          noteHandler.deleteNote(note.id, notebook);
          updateParent?.();
        }}
      />
      {Object.keys(noteHandler.getAllNotes()).length !== 1 ? (
        <ContextMenu.MenuItem
          label="Move Note"
          id="move-note"
          children={Object.keys(noteHandler.getAllNotes()).map((key: string) => {
            if (key !== notebook) {
              return (
                <ContextMenu.MenuItem
                  label={`Move to ${key}`}
                  id={key}
                  key={key}
                  action={() => {
                    noteHandler.moveNote(note, notebook, key);
                    updateParent?.();
                  }}
                />
              );
            }
          })}
        />
      ) : null}
      <ContextMenu.MenuItem
        label="Copy Id"
        id="copy-id"
        action={() => DiscordNative.clipboard.copy(note.id)}
      />
    </ContextMenu.ContextMenu>
  );
};
