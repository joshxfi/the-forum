import { WriteMessageMutation } from "@tf/codegen/__generated__/graphql";
import { create } from "zustand";

type State = {
  tempUpvotes: string[];
  tempMessages: WriteMessageMutation["writeMessage"][];
};

type Action = {
  updateTempUpvotes: (messageId: string) => void;
  updateTempMessages: (messageData: State["tempMessages"][0]) => void;
};

export const useMessageStore = create<State & Action>((set) => ({
  tempUpvotes: [],
  updateTempUpvotes: (messageId) =>
    set((state) => ({ tempUpvotes: [messageId, ...state.tempUpvotes] })),

  tempMessages: [],
  updateTempMessages: (messageData) =>
    set((state) => ({ tempMessages: [messageData, ...state.tempMessages] })),
}));
