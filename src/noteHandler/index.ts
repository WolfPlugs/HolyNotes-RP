/* eslint-disable @typescript-eslint/naming-convention */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { noteFiles } from "./utils";
import { common, webpack } from "replugged";
import { getExportsForProto } from "../noteHandler/utils";
const {
  lodash,
  users: { getUser },
  toast,
} = common;

interface NoteFormat {
  [key: string]: {
    id: string;
    channel_id: string;
    guild_id: string;
    content: string;
    author: {
      id: string;
      avatar: string;
      discriminator: string;
      username: string;
    };
    flags: number;
    timestamp: string;
    attachments: DiscordAttachments[];
    embeds: DiscordEmbeds[];
    reactions: DiscordReactions[];
    stickerItems: DiscordStrickerItems[];
  };
}

interface DiscordAttachments {
  content_type: string;
  filename: string;
  height: number;
  id: string;
  proxy_url: string;
  size: number;
  url: string;
  width: number;
  spoiler: boolean;
}

interface DiscordEmbeds {
  id: string;
  url?: string;
  type: string;
  title?: string;
  rawTitle?: string;
  description?: string;
  rawDescription?: string;
  color?: number | string;
  timestamp?: ISO8601;
  thumbnail?: MediaFormat;
  image?: MediaFormat;
  video?: MediaFormat;
  provider?: {
    name: string;
    url: string;
  };
  fields?: [
    {
      name: string;
      value: string;
      inline?: boolean;
    },
  ];
  footer?: {
    text: string;
    icon_url?: string;
    proxy_icon_url?: string;
  };
  author?: {
    name: string;
    url?: string;
    icon_url?: string;
    proxy_icon_url?: string;
  };
}
interface DiscordStrickerItems {
  id: string;
  format_type: number;
  name: string;
}

interface DiscordReactions {
  emoji: {
    id: string;
    name: string;
    animated?: boolean;
  };
  count: number;
  count_details: {
    burst: number;
    normal: number;
  };
  me: boolean;
  me_burst: boolean;
  burst_count: number;
  burst_colors: string[];
}

interface MediaFormat {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

interface ISO8601 {
  milliseconds: () => ISO8601;
  _isAMomentObject: boolean;
}

export default new (class noteHandler {
  public constructor() {
    this.initNotes();
  }

  public initNotes() {
    return noteFiles;
  }

  public getNotes(getAll = false, notebook = "Main" as string) {
    const thenoteFiles = this.initNotes();
    if (getAll) return thenoteFiles.all();
    return thenoteFiles.get(notebook);
  }

  public addNote(noteCData, noteAData, notebook: string) {
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
    toast.toast(`Successfully added note to ${notebook}.`, toast.Kind.SUCCESS, { duration: 5000 });
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
    toast.toast(`Successfully removed note from ${notebook}.`, toast.Kind.SUCCESS, {
      duration: 5000,
    });
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
    toast.toast(
      `Successfully moved note from ${fromNotebook} to ${toNotebook}.`,
      toast.Kind.SUCCESS,
      { duration: 5000 },
    );
  };

  public newNotebook = (name) => {
    const thenoteFiles = this.initNotes();

    if (!thenoteFiles.has(name)) {
      thenoteFiles.set(name, {});
      toast.toast(`Successfully created ${name}.`, toast.Kind.SUCCESS, { duration: 5000 });
    }
  };

  public deleteNotebook = (notebook) => {
    const thenoteFiles = this.initNotes();

    thenoteFiles.delete(notebook);
    toast.toast(`Successfully deleted ${notebook}.`, toast.Kind.SUCCESS, { duration: 5000 });
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
    toast.toast(`Successfully refreshed the avatars.`, toast.Kind.SUCCESS, { duration: 5000 });
  };
})();
