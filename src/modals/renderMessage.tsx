/* eslint-disable no-use-before-define */
import { common, components, types, webpack } from "replugged";
import noteHandler from "../noteHandler";
import { MyClipboardUtility, getExportsForProto } from "../noteHandler/utils";
import { customExports } from "../index";

const RoutingUtilsModule = webpack.getBySource("transitionTo - Transitioning to ");
const RoutingUtils = {
  transitionToChannel: webpack.getFunctionBySource(
    RoutingUtilsModule as types.ObjectExports,
    "transitionTo - Transitioning to ",
  ),
};

const Timestamp = webpack.getBySource("parseTwoDigitYear");
const { message, groupStart, cozyMessage } = webpack.getByProps("cozyMessage");

const User = webpack.getModule((m) => Boolean(getExportsForProto(m.exports, ["tag", "isClyde"])));

const Message = await webpack.waitForModule<any>((m) =>
  Boolean(getExportsForProto(m.exports, ["getReaction", "isSystemDM"])),
);

const Channel = getExportsForProto(
  await webpack.waitForModule<any>((m) =>
    Boolean(getExportsForProto(m.exports, ["getGuildId", "isForumPost"])),
  ),
  ["getGuildId", "isForumPost"],
);

// replugged.webpack.getModule((m) => ["getGuildId"].every((p) => Object.values(m.exports).some((m) => m?.prototype?.[p]))).Sf

const {
  React: { useState, useEffect },
  contextMenu: { open, close },
} = common;
const { ContextMenu } = components;

//
interface RenderMessageProps {
  note: any;
  notebook: string;
  updateParent: () => void;
  fromDeleteModal: boolean;
  closeModal: () => void;
}

interface ContextMenuProps {
  note: any;
  notebook: string;
  updateParent: () => void;
  fromDeleteModal: boolean;
  closeModal: () => void;
}

export default ({
  note,
  notebook,
  updateParent,
  fromDeleteModal,
  closeModal,
}: RenderMessageProps) => {
  const { ChannelMessage } = customExports;
  const [isHoldingDelete, setHoldingDelete] = useState(false);
  useEffect(() => {
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
          updateParent();
        }
      }}
      // eslint-disable-next-line consistent-return
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
        className={["holy-render", message, groupStart, cozyMessage]}
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
                // @ts-ignore
                author: new User({ ...note.author }),
                // @ts-ignore
                timestamp: new Timestamp(new Date(note.timestamp)),
                embeds: note.embeds.map((embed: { timestamp: string | number | Date }) =>
                  embed.timestamp
                    ? Object.assign(embed, {
                        // @ts-ignore
                        timestamp: new Timestamp(new Date(embed.timestamp)),
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

const NoteContextMenu = (props: object) => {
  const { note, notebook, updateParent, closeModal } = props as ContextMenuProps;
  return (
    <ContextMenu.ContextMenu {...props}>
      <ContextMenu.MenuItem
        label="Jump to message"
        id="jump"
        action={() => {
          RoutingUtils.transitionToChannel(
            `/channels/${note.guild_id ?? "@me"}/${note.channel_id}/${note.id}`,
          );
          closeModal();
        }}
      />
      <ContextMenu.MenuItem
        label="Copy Text"
        id="copy-text"
        action={() => MyClipboardUtility.copyToClipboard(note.content)}
      />
      {note?.attachments.length ? (
        <ContextMenu.MenuItem
          label="Copy Attachment URL"
          id="copy-url"
          action={() => MyClipboardUtility.copyToClipboard(note?.attachments[0].url)}
        />
      ) : null}
      <ContextMenu.MenuItem
        color="danger"
        label="Delete Note"
        id="delete-note"
        action={() => {
          noteHandler.deleteNote(note.id, notebook);
          updateParent();
        }}
      />
      {Object.keys(noteHandler.getNotes(true)).length !== 1 ? (
        <ContextMenu.MenuItem
          label="Move Note"
          id="move-note"
          children={Object.keys(noteHandler.getNotes(true)).map((key: string) => {
            if (key !== notebook) {
              return (
                <ContextMenu.MenuItem
                  label={`Move to ${key}`}
                  id={key}
                  key={key}
                  action={() => {
                    noteHandler.moveNote(note, notebook, key);
                    updateParent();
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
        action={() => MyClipboardUtility.copyToClipboard(note.id)}
      />
    </ContextMenu.ContextMenu>
  );
};
