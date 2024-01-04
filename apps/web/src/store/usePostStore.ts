import { create } from "zustand";
import { PostData } from "@/types";
import { immer } from "zustand/middleware/immer";
import { AddPostMutation } from "@tf/codegen/__generated__/graphql";

type UpdateData<T> = (postId: string, data: T) => void;

type State = {
  posts: Record<string, PostData>;
  comments: Record<string, Record<string, Omit<PostData, "comments">>>;
  upvotes: Record<string, string>;
};

type Action = {
  addPost: (postData: AddPostMutation["addPost"]) => void;
  updateComments: UpdateData<Omit<PostData, "comments">>;
  updateUpvotes: UpdateData<string>;
};

export const usePostStore = create<State & Action>()(
  immer((set) => ({
    posts: {},
    comments: {},
    upvotes: {},

    addPost: (postData) =>
      set((state) => {
        state.posts[postData.id] = {
          ...postData,
          comments: [],
        };
      }),

    updateComments: (postId, commentData) =>
      set((state) => {
        state.comments[postId] = {
          [commentData.id]: commentData,
        };
      }),

    updateUpvotes: (postId, upvoteId) =>
      set((state) => {
        state.upvotes[postId] = upvoteId;
      }),
  }))
);
