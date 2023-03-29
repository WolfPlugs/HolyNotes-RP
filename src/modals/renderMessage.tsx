import { common, webpack, components, Injector } from "replugged";
import noteHandler from "../noteHandler";
import { getExportsForProto, MyClipboardUtility } from "../noteHandler/utils";
import { WhatintheActualFUckAmIDOING } from "../index";
const classes = webpack.getByProps("cozyMessage");
const { ChannelMessage } = webpack.getBySource("flashKey");

const RoutingUtilsModule = webpack.getBySource("transitionTo - Transitioning to ");
const RoutingUtils = {
  transitionToChannel: webpack.getFunctionBySource(
    RoutingUtilsModule,
    "transitionTo - Transitioning to ",
  ),
};

const Timestamp = webpack.getBySource("parseTwoDigitYear");

const Message = await webpack.waitForModule<any>((m) =>
  Boolean(getExportsForProto(m.exports, ["getReaction", "isSystemDM"])),
);

const User = webpack.getModule((m) => Boolean(getExportsForProto(m.exports, ["tag", "isClyde"])));

const Channel = getExportsForProto(
  await webpack.waitForModule<any>((m) => Boolean(getExportsForProto(m.exports, ["getGuildId"]))),
  ["getGuildId"],
);

// replugged.webpack.getModule((m) => ["getGuildId"].every((p) => Object.values(m.exports).some((m) => m?.prototype?.[p]))).Sf

const {
  React,
  contextMenu: { open, close },
} = common;
const { ErrorBoundary, FormItem } = components;

let isHoldingDelete;

const inject = new Injector();

// React.useEffect(() => {

//   const deleteHandler = (e) => e.key === 'Delete' && (isHoldingDelete = e.key === 'keydown')

//   document.addEventListener('keydown', deleteHandler)
//   document.addEventListener('keyup', deleteHandler)

//   return () => {
//     document.removeEventListener('keydown', deleteHandler)
//     document.removeEventListener('keyup', deleteHandler)
//   }
// }, [])

export default ({ note, notebook, upodateParent, fromDeleteModal, closeModal }) => {

  return (
    <ErrorBoundary className="holy-note">
      <ChannelMessage
        message={
          new Message(
            Object.assign(
              { ...note },
              {
                author: new User({ ...note.author }),
                timestamp: new Timestamp(new Date(note.timestamp)),
                embeds: note.embeds.map((embed) =>
                  embed.timestamp
                    ? Object.assign(embed, {
                        timestamp: new Timestamp(new Date(embed.timestamp)),
                      })
                    : embed,
                ),
              },
            ),
          )
        }
        channel={new Channel({ id: "holy-notes" })}
        onLCick={() => {
          if (isHoldingDelete && !fromDeleteModal) {
            noteHandler.deleteNote(note.id, notebook);
            upodateParent();
          }
        }}
        onContextMenu={(event) => {
          if (!fromDeleteModal)
            return open(event, () => (
              <NoteContextMenu
                note={note}
                notebook={notebook}
                updateParent={updateParent}
                closeModal={closeModal}
              />
            ));
        }}
        compact={false}
        isHighlight={false}
        isLastItem={false}
        renderContentOnly={false}
      />
    </ErrorBoundary>
  );
};

const NoteContextMenu = ({ note, notebook, updateParent, closeModal }) => {
  return (
    <>
      <contextMenu onClose={close}>
        <FormItem
          label="Jump to message"
          id="jump"
          action={() => {
            RoutingUtils.transitionToChannel(
              `/channels/${note.guild_id ?? "@me"}/${note.channel_id}/${note.id}`,
            );
            closeModal();
          }}
        />
        <FormItem
          label="Copy Text"
          id="ctext"
          action={() => MyClipboardUtility.copyToClipboard(note.content)}
        />
        <FormItem
          color="colorDanger"
          label="Delete Note"
          id="delete"
          action={() => {
            noteHandler.deleteNote(note.id, notebook);
            updateParent();
          }}
        />
        {Object.keys(noteHandler.getNotes()).length !== 1 ? (
          <FormItem label="Move Note" id="move">
            {Object.keys(noteHandler.getNotes()).map((key: string) => {
              if (key !== notebook) {
                return (
                  <FormItem
                    label={`Move to ${key}`}
                    id={key}
                    action={() => {
                      noteHandler.moveNote(note.id, notebook, key);
                      updateParent();
                    }}
                  />
                );
              }
            })}
          </FormItem>
        ) : null}
        <FormItem
          label="Copy Id"
          id="cid"
          action={() => MyClipboardUtility.copyToClipboard(note.id)}
        />
      </contextMenu>
    </>
  );
};
