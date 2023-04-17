/* eslint-disable @typescript-eslint/naming-convention */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { noteFiles } from "./utils";
import { common, webpack } from "replugged";
import { getExportsForProto } from "../noteHandler/utils";

const {
  lodash,
  users: { getUser },
} = common;

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
    // @ts-expect-error notebook thinks string is not good enough
    return thenoteFiles.get(notebook);
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
        flags: noteAData.flags,
        timestamp: noteAData.timestamp,
        attachments: noteAData.attachments,
        embeds: noteAData.embeds,
        reactions: noteAData.reactions,
        stickerItems: noteAData.stickerItems,
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

    if (!thenoteFiles.has(name)) thenoteFiles.set(name, {});
  };

  public deleteNotebook = (notebook) => {
    const thenoteFiles = this.initNotes();

    thenoteFiles.delete(notebook);
  };

  public refreshAvatars = async () => {
    const thenoteFiles = this.initNotes();
    let notes;
    try {
      notes = this.getNotes(true);
    } catch {
      return;
    }

    const User = webpack.getModule((m) =>
      Boolean(getExportsForProto(m.exports, ["tag", "isClyde"])),
    );

    for (let notebook in notes) {
      for (let noteID in notes[notebook]) {
        let note = notes[notebook][noteID];
        let user =
          getUser(note.author.id) ??
          (await getUser(note.author.id)) ??
          // @ts-expect-error User uh doesnt have construct but it does
          new User({ ...note.author });

        Object.assign(notes[notebook][noteID].author, {
          avatar: user.avatar,
          discriminator: user.discriminator,
          username: user.username,
        });
      }
    }

    for (let notebook in notes) {
      // @ts-expect-error note book being a bad boy wants mommy main but no
      thenoteFiles.set(notebook, notes[notebook]);
    }
  };
})();
