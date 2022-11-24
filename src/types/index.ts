export type ConversationInfo = {
  users: string[];
  group?: {
    admins: string[];
    groupName: null | string;
    groupImage: null | string;
  };

  seen: {
    [key: string]: string;
  };
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  };
  theme: string;
};

export type SavedUser = {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL: string;
  phoneNumber: string | null;
};

export type MessageItem = {
  id?: string;
  sender: string;
  content: string;
  replyTo?: string;
  file?: {
    name: string;
    size: number;
  };
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  type: 'text' | 'image' | 'file' | 'sticker' | 'removed';
  reactions: {
    [key: string]: number;
  };
};

export type StickerCollection = {
  name: string;
  thumbnail: string;
  icon: string;
  id: string;
  stickers: {
    id: string;
    spriteURL: string;
  }[];
};

export type StickerCollections = StickerCollection[];
