/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Discord {
  type MessageAttachment = import("discord-types/general").MessageAttachment;
  type MessageReaction = import("discord-types/general").MessageReaction;
  type Moment = import("moment").Moment;

  export type User = import("discord-types/general").User;
  export type Embed = import("discord-types/general").Embed;
  export type Channel = import("discord-types/general").Channel;
  export type Message = import("discord-types/general").Message;

  export type UserConstructor = new (user: { id: string }) => User;
  export type MessageConstructor = new (message: { id: string }) => Message;
  export type MomentConstructor = new (time: Date | number) => Moment;

  export interface Attachment extends MessageAttachment {
    sensitive: boolean;
  }

  export interface Reaction extends MessageReaction {
    burst_colors: string[];
    borst_count: number;
    count_details: { burst: number; normal: number };
    me_burst: boolean;
  }

  export interface Sticker {
    format_type: number;
    id: string;
    name: string;
  }

  export interface ChannelHeader {
    "aria-label": string;
    channelId: string;
    channelType: number;
    children: JSX.Element[];
    className: string;
    guildId: string;
    hideSearch: boolean;
    mobileToolbar: JSX.Element[];
    toolbar: JSX.Element[];
    transparent: boolean;
  }

  export interface ChannelMessageProps extends React.HTMLAttributes<HTMLDivElement> {
    key: string;
    groupId: string;
    id: string;
    compact: boolean;
    isHighlight: boolean;
    isLastItem: boolean;
    renderContentOnly: boolean;
    channel: Channel;
    message: Message;
  }
}

declare namespace HolyNotes {
  export interface Note {
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
    attachments: Discord.Attachment[];
    embeds: Discord.Embed[];
    reactions: Discord.Reaction[];
    stickerItems: Discord.Sticker[];
  }
}

declare namespace Replugged {
  export namespace Components {
    enum ModalTransitionState {
      ENTERING = 0,
      ENTERED = 1,
      EXITING = 2,
      EXITED = 3,
      HIDDEN = 4,
    }

    export interface ModalRootProps {
      transitionState?: ModalTransitionState;
      size?: "small" | "medium" | "large" | "dynamic";
      role?: "alertdialog" | "dialog";
      className?: string;
      onAnimationEnd?(): string;
    }

    export interface ContextMenuProps {
      navId: string;
      onClose: () => void;
      className?: string;
      style?: React.CSSProperties;
      hideScroller?: boolean;
      onSelect?: () => void;
    }
  }
}

declare const DiscordNative: {
  clipboard: {
    copy: (content: string) => void;
    copyImage: (content: Blob) => void;
    cut: () => void;
    paste: () => void;
    read: () => string;
  };
};
