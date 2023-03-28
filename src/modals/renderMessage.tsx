import { common, webpack, components } from "replugged";
import noteHandler from "../noteHandler";
import { getExportsForProto, MyClipboardUtility } from "../noteHandler/utils";

const { contextMenu: { open } } = common;
const { FormItem } = components;
const classes = webpack.getByProps("cozyMessage");
const ChannelMessage = webpack.getBySource('flashKey')


const User = webpack.getModule((m) => ["tag"].every((p) => Object.values(m.exports).some((m) => m?.prototype?.[p]))).o

const RoutingUtilsModule = webpack.getBySource("transitionTo - Transitioning to ");
const RoutingUtils = {
  transitionToChannel: webpack.getFunctionBySource(
    RoutingUtilsModule,
    "transitionTo - Transitioning to ",
  ),
}


const Timestamp = await webpack.waitForModule<any>((m) =>
  Boolean(getExportsForProto(m.exports, ["month", "toDate"])),
);

const Message = await webpack.waitForModule<any>((m) =>
  Boolean(getExportsForProto(m.exports, ["getReaction", "isSystemDM"])),
);

const Channel = await webpack.waitForModule<any>((m) =>
  Boolean(getExportsForProto(m.exports, ["getGuildId"])),
);

// replugged.webpack.getModule((m) => ["getGuildId"].every((p) => Object.values(m.exports).some((m) => m?.prototype?.[p]))).Sf


const { React, contextMenu, } = common;
const { ErrorBoundary } = components;

let isHoldingDelete;
React.useEffect(() => {

  const deleteHandler = (e) => e.key === 'Delete' && (isHoldingDelete = e.key === 'keydown')


  document.addEventListener('keydown', deleteHandler)
  document.addEventListener('keyup', deleteHandler)

  return () => {
    document.removeEventListener('keydown', deleteHandler)
    document.removeEventListener('keyup', deleteHandler)
  }
}, [])

export default ({ note, notebook, upodateParent, fromDeleteModal, closeModal }) => {
  console.log(note)
  return (
    <ErrorBoundary className='holy-note'>
      <ChannelMessage
        style={{ marginBottom: '5px', marginTop: '5px', paddingTop: '5px', paddingBottom: '5px' }}
        className={[classes.message, classes.cozyMessage, classes.groupStart].join(' ')}
        message={
          new Message(
            Object.assign({ ...note }, {
              author: new User({ ...note.author }),
              timestamp: new Timestamp(new Date(note.timestamp)),
              embeds: note.embeds.map(embed => embed.timestamp ? Object.assign(embed, {
                timestamp: new Timestamp(new Date(embed.timestamp))
              }) : embed)
            })
          )
        }
        channel={new Channel({ id: 'holy-notes' })}
        onLCick={() => {
          if (isHoldingDelete && !fromDeleteModal) {
            noteHandler.deleteNote(note.id, notebook)
            upodateParent()
          }
        }}
        onContextMenu={event => {
          if (!fromDeleteModal)
            return (
              open(event, () =>
                <NoteContextMenu
                  note={note}
                  notebook={notebook}
                  updateParent={updateParent}
                  closeModal={closeModal}
                />
              )
            )
        }}
      />
    </ErrorBoundary>
  )

};

const NoteContextMenu = ({ note, notebook, updateParent, closeModal }) => {
  return <>
    <contextMenu onClose={contextMenu.close}>
      <FormItem
        label='Jump to message' id='jump'
        action={() => {
          RoutingUtils.transitionToChannel(`/channels/${note.guild_id ?? '@me'}/${note.channel_id}/${note.id}`)
          closeModal()
        }} />
      <FormItem
        label='Copy Text' id='ctext'
        action={() => MyClipboardUtility.copyToClipboard(note.content)} />
      <FormItem
        color='colorDanger'
        label='Delete Note' id='delete'
        action={() => {
          noteHandler.deleteNote(note.id, notebook)
          updateParent()
        }} />
      {Object.keys(noteHandler.getNotes()).length !== 1 ?
        <FormItem
          label='Move Note' id='move'>
          {Object.keys(noteHandler.getNotes()).map((key: string) => {
            if (key !== notebook) {
              return (
                <FormItem
                  label={`Move to ${key}`} id={key}
                  action={() => {
                    noteHandler.moveNote(note.id, notebook, key)
                    updateParent()
                  }} />
              )
            }
          }
          )}
        </FormItem> : null}
      <FormItem
        label='Copy Id' id='cid'
        action={() => MyClipboardUtility.copyToClipboard(note.id)} />
    </contextMenu>
  </>
}
