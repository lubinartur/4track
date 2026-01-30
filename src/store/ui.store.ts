import { create } from 'zustand';

interface UIStore {
  isChatOpen: boolean;
  chatContext: string;
  isAddOpen: boolean;
  openChat: (context: string) => void;
  closeChat: () => void;
  openAdd: () => void;
  closeAdd: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isChatOpen: false,
  chatContext: '',
  isAddOpen: false,
  openChat: (context: string) => set({ isChatOpen: true, chatContext: context }),
  closeChat: () => set({ isChatOpen: false, chatContext: '' }),
  openAdd: () => set({ isAddOpen: true }),
  closeAdd: () => set({ isAddOpen: false }),
}));
