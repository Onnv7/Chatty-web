import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ConversationEntity,
  ConversationSelectedEntity,
  UpdateNewActiveFriendEntity,
  UpdateNewMessageEntity,
} from '../../../../domain/entity/conversation.entity';
import { conversationRepository } from '../../../../data/repository';
import { PageEntity } from '../../../../domain/entity/common.entity';
import { number } from 'zod';

type ConversationReduxType = {
  pageEntity: PageEntity;
  conversationList: ConversationEntity[];
  conversationSelected: string | null;
  reloadConversationList: boolean;
};

const initialState: ConversationReduxType = {
  pageEntity: {
    currentPage: 1,
    pageSize: 10,
  },
  conversationList: [],
  conversationSelected: null,
  reloadConversationList: true,
};
export const getConversationPageThunk = createAsyncThunk(
  'conversation/get-conversation-page',
  async ({ userId }: { userId: number }, thunkAPI) => {
    try {
      const state = (thunkAPI.getState() as any).conversation;

      const { totalPage, conversationList } =
        await conversationRepository.getConversationPage(
          1,
          state.pageEntity.pageSize,
          userId!,
        );

      return { totalPage, conversationList };
    } catch (error) {
      return thunkAPI.rejectWithValue('Loading failed');
    }
  },
);

export const getNextConversationPageThunk = createAsyncThunk(
  'conversation/get-next-conversation-page',
  async ({ userId }: { userId: number }, thunkAPI) => {
    try {
      const state = (thunkAPI.getState() as any)
        .conversation as ConversationReduxType;
      const nextPage = state.pageEntity.currentPage + 1;
      if (nextPage <= (state.pageEntity.totalPage ?? 1)) {
        const { totalPage, conversationList } =
          await conversationRepository.getConversationPage(
            nextPage,
            state.pageEntity.pageSize,
            userId!,
          );
        return { totalPage, conversationList };
      }
    } catch (error) {
      return thunkAPI.rejectWithValue('Loading failed');
    }
  },
);

const conversationSlice = createSlice({
  name: 'slice',
  initialState: initialState,
  reducers: {
    setConversationSelected: (state, action: PayloadAction<string | null>) => {
      state.conversationSelected = action.payload;
    },
    updateNewConversation: (
      state,
      action: PayloadAction<UpdateNewMessageEntity>,
    ) => {
      const payload = action.payload;
      const conversationList = state.conversationList
        .map((conv) => {
          if (conv.id === payload.conversationId) {
            return {
              ...conv,
              senderId: payload.senderId,
              lastMessage: payload.content,
              lastSendAt: payload.createdAt,
            };
          }
          return conv;
        })
        .sort(
          (a, b) =>
            new Date(b.lastSendAt).getTime() - new Date(a.lastSendAt).getTime(),
        );
      state.conversationList = conversationList;
    },
    updateNewActiveFriend: (
      state,
      action: PayloadAction<UpdateNewActiveFriendEntity>,
    ) => {
      state.conversationList = [
        ...state.conversationList.map((conv) => {
          if (conv.friendId === action.payload.friendId) {
            return {
              ...conv,
              activeStatus: action.payload.activeStatus,
              lastActiveAt: new Date().toString(),
            };
          }
          return conv;
        }),
      ];
    },
    refreshCallConversationList: (state, action: PayloadAction<boolean>) => {
      state.reloadConversationList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConversationPageThunk.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload.conversationList.length > 0) {
        const firstConversation = payload.conversationList[0];
        // state.conversationSelected = {
        //   id: firstConversation.id,
        //   roomName: firstConversation.name,
        //   imageUrl: firstConversation.imageUrl,
        // };
      }
      state.conversationList = payload.conversationList;
      state.pageEntity = {
        ...state.pageEntity,
        totalPage: payload.totalPage,
      };
    });
    builder.addCase(getNextConversationPageThunk.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload !== undefined) {
        state.conversationList = [
          ...state.conversationList,
          ...payload.conversationList,
        ];
        state.pageEntity = {
          ...state.pageEntity,
          currentPage: state.pageEntity.currentPage + 1,
          totalPage: payload.totalPage,
        };
      }
    });
  },
});
export const {
  setConversationSelected,
  updateNewConversation,
  updateNewActiveFriend,
  refreshCallConversationList,
} = conversationSlice.actions;
export default conversationSlice.reducer;
