import { common, webpack, components } from "replugged";

import noteHandler from "../noteHandler";
import { ContextMenu } from "replugged/dist/renderer/modules/common";

const classes = webpack.getByProps("cozyMessage");
const ChannelMessage = webpack.getBySource('flashKey', 'isHighlight')
const Timestamp = webpack.getModule(m => m.exports?.prototype?.month && m.exports.prototype.toDate)
const Message = webpack.getModule((m) => ["getReaction", "isSystemDM"].every((p) => Object.values(m.exports).some((m) => m?.prototype?.[p])))
const Channel = webpack.getModule((m) => ["getGuildId"].every((p) => Object.values(m.exports).some((m) => m?.prototype?.[p]))).Sf
const User = webpack.getModule((m) => ["tag"].every((p) => Object.values(m.exports).some((m) => m?.prototype?.[p]))).o
const transitionTo = webpack.getBySource('.log("transitionTo - Transitioning to ".concat(').uL
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
              contextMenu.open(event, () =>
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
      <contextMenu.Item
        label='Jump to message' id='jump'
        action={() => {
          transitionTo(`/channels/${note.guild_id ?? '@me'}/${note.channel_id}/${note.id}`)
          closeModal()
        }} />
      <contextMenu.Item
        label='Copy Text' id='ctext'
        action={() => copyText(note.content)} />
      <contextMenu.Item
        color='colorDanger'
        label='Delete Note' id='delete'
        action={() => {
          noteHandler.deleteNote(note.id, notebook)
          updateParent()
        }} />
      {Object.keys(noteHandler.getNotes()).length !== 1 ?
        <contextMenu.Item
          label='Move Note' id='move'>
          {Object.keys(noteHandler.getNotes()).map(key => {
            if (key != notebook) {
              return (
                <contextMenu.Item
                  label={`Move to ${key}`} id={key}
                  action={() => {
                    noteHandler.moveNote(note.id, notebook, key)
                    updateParent()
                  }} />
              )
            }
          }
          )}
        </contextMenu.Item> : null}
      <contextMenu.Item
        label='Copy Id' id='cid'
        action={() => copyText(note.id)} />
    </contextMenu>
  </>
}
