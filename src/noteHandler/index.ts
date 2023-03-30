/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { noteFiles } from "./utils";
import { common } from 'replugged'

const { lodash } = common

export default new (class noteHandler {
  public constructor() {
    void this.initNotes();
  }

  public initNotes() {
    return noteFiles;
  }

  public getNotes(getAll = false, notebook = "Main") {
    const thenoteFiles = this.initNotes();
    if (getAll) return thenoteFiles.all();
    return thenoteFiles.get(notebook, {});
  }

  public addNote(noteCData, noteAData, notebook) {
    const thenoteFiles = this.initNotes();
    let notes;
    try {
      notes = this.getNotes(false, notebook);
    } catch {
      return;
    }
    let noteFormat = {
      [noteAData.id]: {
        id: noteAData.id,
        channel_id: noteAData.channel_id,
        guild_id: noteCData.guild_id,
        content: noteAData.content,
        author: {
          id: noteAData.author.id,
          avatar: noteAData.author.avatar,
          discriminator: noteAData.author.discriminator,
          username: noteAData.author.username,
        },
        timestamp: noteAData.timestamp,
        attachments: noteAData.attachments,
        embeds: noteAData.embeds,
        reactions: noteAData.reactions,
      },
    };

    const newNotes = JSON.parse(JSON.stringify(notes));
    Object.assign(newNotes, noteFormat);
    const newNotesString = JSON.stringify(newNotes);
    const clonedNotes = JSON.parse(newNotesString);
    thenoteFiles.set(notebook, clonedNotes);
  }

  public deleteNote = (note, notebook) => {
    const thenoteFiles = this.initNotes();
    let notes;
    try {
      notes = this.getNotes(false, notebook);
    } catch {
      return;
    }

    const index = lodash.omit(notes, note);
    thenoteFiles.set(notebook, index);

  };

  public moveNote = (note, fromNotebook, toNotebook) => {
    const thenoteFiles = this.initNotes();
    let fromNotebookNotes;
    let toNotebookNotes;
    try {
      fromNotebookNotes = this.getNotes(false, fromNotebook);
      toNotebookNotes = this.getNotes(false, toNotebook);
    } catch {
      return;
    }

    const index = lodash.omit(fromNotebookNotes, note.id);
    Object.assign(toNotebookNotes, { [note.id]: note });
    thenoteFiles.set(toNotebook, toNotebookNotes);
    thenoteFiles.set(fromNotebook, index);
  };

  public newNotebook = (name) => {
    const thenoteFiles = this.initNotes();
    let notes
    try { notes = this.getNotes(true) }
    catch { return }
    console.log(thenoteFiles)
    Object.assign(notes, { [name]: {} })

    //fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
  }

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
