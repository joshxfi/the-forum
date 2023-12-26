import {
  WriteMessageMutation,
  WriteReplyMutation,
} from "@tf/codegen/__generated__/graphql";
import { create } from "zustand";

type State = {
  tempUpvotes: {
    upvoteId?: string;
    messageId: string;
  }[];
  tempMessages: WriteMessageMutation["writeMessage"][];
  tempReplies: {
    messageId: string;
    replyData: WriteReplyMutation["writeReply"][];
  }[];
};

type Action = {
  updateTempUpvotes: (upvoteData: State["tempUpvotes"][0]) => void;
  updateTempMessages: (messageData: State["tempMessages"][0]) => void;
  updateTempReplies: ({
    messageId,
    replyData,
  }: State["tempReplies"][0]) => void;
};

export const useMessageStore = create<State & Action>((set) => ({
  tempUpvotes: [],
  updateTempUpvotes: ({ upvoteId, messageId }) =>
    set((state) => {
      const upvote = state.tempUpvotes.find((u) => u.messageId === messageId);
      const upvoteIndex = state.tempUpvotes.findIndex(
        (u) => u.messageId === messageId
      );

      if (!!upvote) {
        const upvotes = state.tempUpvotes.slice(0);

        upvotes[upvoteIndex] = {
          messageId,
          upvoteId: !!upvote.upvoteId ? "" : upvoteId,
        };

        return {
          tempUpvotes: upvotes,
        };
      }

      return { tempUpvotes: [{ upvoteId, messageId }, ...state.tempUpvotes] };
    }),

  tempMessages: [],
  updateTempMessages: (messageData) =>
    set((state) => ({ tempMessages: [messageData, ...state.tempMessages] })),

  tempReplies: [],
  updateTempReplies: ({ messageId, replyData }) =>
    set((state) => {
      const reply = state.tempReplies.find(
        (r) => r.messageId === messageId
      )?.replyData;

      if (!!reply) {
        const messageIndex = state.tempReplies.findIndex(
          (r) => r.messageId === messageId
        );

        const replies = state.tempReplies.slice(0);
        replies[messageIndex] = {
          messageId,
          replyData: [...reply, ...replyData],
        };

        return {
          tempReplies: replies,
        };
      }

      return {
        tempReplies: [...state.tempReplies, { messageId, replyData }],
      };
    }),
}));
