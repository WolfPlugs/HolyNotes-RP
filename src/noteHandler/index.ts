/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { noteFiles } from "./settings";

export default new (class noteHandler {
  public constructor() {
    void this.initNotes();
  }

  public initNotes() {
    return noteFiles;
  }

  public getNotes() {
    const thenoteFiles = this.initNotes();
    return thenoteFiles.all();
  }

  public addNote(noteData, notebook) {
    this.initNotes();
    let notes;
    try {
      notes = this.getNotes();
    } catch {
      return;
    }

    let noteFormat = {
      [noteData.message.id]: {
        id: noteData.message.id,
        channel_id: noteData.channel.id,
        guild_id: noteData.channel.guild_id,
        content: noteData.message.content,
        author: {
          id: noteData.message.author.id,
          avatar: noteData.message.author.avatar,
          discriminator: noteData.message.author.discriminator,
          username: noteData.message.author.username,
        },
        timestamp: noteData.message.timestamp,
        attachments: noteData.message.attachments,
        embeds: noteData.message.embeds,
        reactions: noteData.message.reactions,
      },
    };

    Object.assign(notes[notebook], noteFormat);
    // fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
  }

  public deleteNote = (note, notebook) => {
    this.initNotes()
    let notes
    try { notes = this.getNotes() }
    catch { return }

    delete notes[notebook][note]

    // fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
  }

  // public moveNote = (note, toNotebook, fromNotebook) => {
  //   this.initNotes()
  //   let notes
  //   try { notes = this.getNotes() }
  //   catch { return }

  //   delete notes[fromNotebook][note.id]
  //   Object.assign(notes[toNotebook], { [note.id]: note })
  //   fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
  // }

  // public newNotebook = (name) => {
  //   this.initNotes()
  //   let notes
  //   try { notes = this.getNotes() }
  //   catch { return }

  //   Object.assign(notes, { [name]: {} })
  //   fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
  // }

  // public deleteNotebook = (notebook) => {
  //   this.initNotes()
  //   let notes
  //   try { notes = this.getNotes() }
  //   catch { return }

  //   delete notes[notebook]
  //   fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
  // }

  // public refreshAvatars = async () => {
  //   this.initNotes()
  //   let notes
  //   try { notes = this.getNotes() }
  //   catch { return }

  //   const { getModule } = require('powercord/webpack')
  //   const User = getModule(m => m?.prototype?.tag, false)
  //   const getCachedUser = getModule(['getCurrentUser', 'getUser'], false).getUser
  //   const fetchUser = getModule(['getUser'], false).getUser

  //   for (let notebook in notes) {
  //     for (let noteID in notes[notebook]) {
  //       let note = notes[notebook][noteID]
  //       let user = getCachedUser(note.author.id)
  //         ?? await fetchUser(note.author.id)
  //         ?? new User({ ...note.author })

  //       Object.assign(notes[notebook][noteID].author, {
  //         avatar: user.avatar,
  //         discriminator: user.discriminator,
  //         username: user.username
  //       })
  //     }
  //   }

  //   fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
  // }
})();
