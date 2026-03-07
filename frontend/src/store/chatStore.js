import { create } from 'zustand'

export const useChatStore = create((set, get) => ({
  // State
  conversations: [],
  currentConversationId: null,
  messages: [],
  isLoading: false,
  isTyping: false,
  error: null,

  // Actions
  setConversations: (conversations) => set({ conversations }),
  
  setCurrentConversation: (id) => set({ 
    currentConversationId: id,
    messages: []
  }),
  
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setTyping: (isTyping) => set({ isTyping }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  // Reset
  reset: () => set({
    conversations: [],
    currentConversationId: null,
    messages: [],
    isLoading: false,
    isTyping: false,
    error: null
  })
}))
