import { create } from "zustand";

type State = {
  tempUpvotes: string[];
};

type Action = {
  updateTempUpvotes: (messageId: string) => void;
};

export const useMessageStore = create<State & Action>((set) => ({
  tempUpvotes: [],
  updateTempUpvotes: (messageId) =>
    set((state) => ({ tempUpvotes: [messageId, ...state.tempUpvotes] })),
}));
