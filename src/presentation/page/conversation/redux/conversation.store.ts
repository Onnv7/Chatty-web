import { configureStore } from '@reduxjs/toolkit';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import conversationSlice from './conversation.slice';

export const conversationStore = configureStore({
  reducer: {
    conversation: conversationSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export const useConversationDispatch: () => typeof conversationStore.dispatch =
  useDispatch;

export const useConversationSelector: TypedUseSelectorHook<
  ReturnType<typeof conversationStore.getState>
> = useSelector;

export const conversationSelector = (
  state: ReturnType<typeof conversationStore.getState>,
) => state.conversation;
