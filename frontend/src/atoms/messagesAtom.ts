import { atom } from "recoil";

interface Participant {
  _id: string;
  username: string;
  name: string;
}

interface LastMessage {
  text: string;
  sender: { _id: string; name: string };
}

interface Conversation {
  lastMessage: LastMessage;
  _id: string;
  participants: Participant[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const conversationsAtom = atom<Conversation[]>({
  key: "conversationsAtom",
  default: [],
});

interface Message {
  _id: string;
  conversationId: string;
  sender: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const messagesAtom = atom<Message[]>({
  key: "messagesAtom",
  default: [],
});
