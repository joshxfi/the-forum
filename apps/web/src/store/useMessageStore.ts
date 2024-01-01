import { PostData } from "@/types";
import {
  AddPostMutation,
} from "@tf/codegen/__generated__/graphql";
import { create } from "zustand";

type State = {
  tempUpvotes: {
    upvoteId?: string;
    messageId: string;
  }[];
  tempMessages: AddPostMutation["addPost"][];
  tempComments: {
    messageId: string;
    commentData: Omit<PostData, 'comments'>[];
  }[];
};

type Action = {
  updateTempUpvotes: (upvoteData: State["tempUpvotes"][0]) => void;
  updateTempMessages: (messageData: State["tempMessages"][0]) => void;
  updateTempComments: ({
    messageId,
    commentData,
  }: State["tempComments"][0]) => void;
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

  tempComments: [],
  updateTempComments: ({ messageId, commentData }) =>
    set((state) => {
      const comment = state.tempComments.find(
        (r) => r.messageId === messageId
      )?.commentData;

      if (!!comment) {
        const messageIndex = state.tempComments.findIndex(
          (r) => r.messageId === messageId
        );

        const replies = state.tempComments.slice(0);
        replies[messageIndex] = {
          messageId,
          commentData: [...comment, ...commentData],
        };

        return {
          tempComments: replies,
        };
      }

      return {
        tempComments: [...state.tempComments, { messageId, commentData }],
      };
    }),
}));
