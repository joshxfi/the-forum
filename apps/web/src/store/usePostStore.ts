import { create } from "zustand";
import { PostData } from "@/types";
import {
  AddPostMutation,
  AddTagMutation,
} from "@tf/codegen/__generated__/graphql";

type State = {
  tempUpvotes: {
    upvoteId?: string;
    postId: string;
  }[];
  tempPosts: (AddPostMutation["addPost"] & {
    tags?: AddTagMutation["addTag"][];
  })[];
  tempComments: {
    postId: string;
    commentData: Omit<PostData, "comments">[];
  }[];
};

type Action = {
  updateTempUpvotes: (upvoteData: State["tempUpvotes"][0]) => void;
  updateTempPosts: (postData: State["tempPosts"][0]) => void;
  updateTempComments: ({
    postId,
    commentData,
  }: State["tempComments"][0]) => void;
};

export const usePostStore = create<State & Action>((set) => ({
  tempUpvotes: [],
  updateTempUpvotes: ({ upvoteId, postId }) =>
    set((state) => {
      const upvote = state.tempUpvotes.find((u) => u.postId === postId);
      const upvoteIndex = state.tempUpvotes.findIndex(
        (u) => u.postId === postId
      );

      if (!!upvote) {
        const upvotes = state.tempUpvotes.slice(0);

        upvotes[upvoteIndex] = {
          postId,
          upvoteId: !!upvote.upvoteId ? "" : upvoteId,
        };

        return {
          tempUpvotes: upvotes,
        };
      }

      return { tempUpvotes: [{ upvoteId, postId }, ...state.tempUpvotes] };
    }),

  tempPosts: [],
  updateTempPosts: (postData) =>
    set((state) => ({ tempPosts: [postData, ...state.tempPosts] })),

  tempComments: [],
  updateTempComments: ({ postId, commentData }) =>
    set((state) => {
      const comment = state.tempComments.find(
        (r) => r.postId === postId
      )?.commentData;

      if (!!comment) {
        const postIndex = state.tempComments.findIndex(
          (r) => r.postId === postId
        );

        const replies = state.tempComments.slice(0);
        replies[postIndex] = {
          postId,
          commentData: [...comment, ...commentData],
        };

        return {
          tempComments: replies,
        };
      }

      return {
        tempComments: [...state.tempComments, { postId, commentData }],
      };
    }),
}));
