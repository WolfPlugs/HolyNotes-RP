/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { noteFiles } from "./utils";
import { common } from "replugged";

const { lodash } = common;

export default new (class noteHandler {
  public constructor() {
    void this.initNotes();
  }

  public initNotes() {
    return noteFiles;
  }

  public getNotes() {
    const thenoteFiles = this.initNotes();
    return thenoteFiles.get("Main");
  }

  public addNote(noteCData, noteAData, notebook) {
    const thenoteFiles = this.initNotes();

    let notes;
    try {
      notes = this.getNotes();
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

    const newNotes = Object.assign(notes, noteFormat);
    thenoteFiles.set("Main", newNotes);
  }

  public deleteNote = (note, notebook) => {
    this.initNotes();
    let notes;
    try {
      notes = this.getNotes();
    } catch {
      return;
    }

    delete notes[notebook][note];

    // fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
  };

  public moveNote = (note, toNotebook, fromNotebook) => {
    this.initNotes();
    let notes;
    try {
      notes = this.getNotes();
    } catch {
      return;
    }

    delete notes[fromNotebook][note.id];
    Object.assign(notes[toNotebook], { [note.id]: note });
    // fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
  };

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
