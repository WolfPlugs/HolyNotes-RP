/* eslint-disable @typescript-eslint/naming-convention */
import { common, webpack } from "replugged";
import { defaultSettings, getExportsForProto, noteFiles } from "./utils";
import type { Channel, Message } from "discord-types/general";

const {
  lodash,
  users: { getUser },
  toast,
} = common;

export default new (class NoteHandler {
  private _formatNote(channel: Channel, message: Message): HolyNotes.Note {
    return {
      id: message.id,
      channel_id: message.channel_id,
      guild_id: channel.guild_id,
      content: message.content,
      author: {
        id: message.author.id,
        avatar: message.author.avatar,
        discriminator: message.author.discriminator,
        username: message.author.username,
      },
      flags: message.flags,
      // Moment has a toString() function, this doesn't convert to '[object Object]'.
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      timestamp: message.timestamp.toString(),
      attachments: message.attachments as Discord.Attachment[],
      embeds: message.embeds,
      reactions: message.reactions as Discord.Reaction[],
      stickerItems: message.stickerItems,
    };
  }

  public getNotes(notebook: keyof typeof defaultSettings): Record<string, HolyNotes.Note> {
    return noteFiles.get(notebook);
  }

  public getAllNotes(): Record<string, Record<string, HolyNotes.Note>> {
    return noteFiles.all() as Record<string, Record<string, HolyNotes.Note>>;
  }

  public addNote = (
    channel: Channel,
    message: Message,
    notebook: keyof typeof defaultSettings,
  ): void => {
    const notes = this.getNotes(notebook);
    const newNotes = Object.assign({ [message.id]: this._formatNote(channel, message) }, notes);

    noteFiles.set(notebook, newNotes);

    toast.toast(`Successfully added note to ${notebook}.`, toast.Kind.SUCCESS, { duration: 5000 });
  };

  public deleteNote = (noteId: string, notebook: keyof typeof defaultSettings): void => {
    const notes = this.getNotes(notebook);

    noteFiles.set(notebook, lodash.omit(notes, noteId));

    toast.toast(`Successfully removed note from ${notebook}.`, toast.Kind.SUCCESS, {
      duration: 5000,
    });
  };

  public moveNote = (
    note: HolyNotes.Note,
    from: keyof typeof defaultSettings,
    to: keyof typeof defaultSettings,
  ): void => {
    const origNotebook = this.getNotes(from);
    const newNotebook = lodash.clone(this.getNotes(to));

    newNotebook[note.id] = note;

    noteFiles.set(from, lodash.omit(origNotebook, note.id));
    noteFiles.set(to, newNotebook);

    toast.toast(`Successfully moved note from ${from} to ${to}.`, toast.Kind.SUCCESS, {
      duration: 5000,
    });
  };

  public newNotebook = (notebookName: string): void => {
    if (noteFiles.has(notebookName)) return;

    noteFiles.set(notebookName, {} as Record<string, HolyNotes.Note>);
    toast.toast(`Successfully created ${notebookName}.`, toast.Kind.SUCCESS, { duration: 5000 });
  };

  public deleteNotebook = (notebookName: string): void => {
    noteFiles.delete(notebookName);
    toast.toast(`Successfully deleted ${notebookName}.`, toast.Kind.SUCCESS, { duration: 5000 });
  };

  public refreshAvatars = async (): Promise<void> => {
    const notebooks = this.getAllNotes();

    const User = await webpack.waitForModule((m) =>
      Boolean(getExportsForProto(m.exports, ["tag", "isClyde"])),
    );

    for (const notebook in notebooks)
      for (const noteId in notebooks[notebook]) {
        const note = notebooks[notebook][noteId];
        const user = getUser(note.author.id) ?? new User({ ...note.author });

        Object.assign(notebooks[notebook][noteId].author, {
          avatar: user.avatar,
          discriminator: user.discriminator,
          username: user.username,
        });
      }

    for (let notebook in notebooks) noteFiles.set(notebook, notebooks[notebook]);

    toast.toast(`Successfully refreshed the avatars.`, toast.Kind.SUCCESS, { duration: 5000 });
  };
})();
