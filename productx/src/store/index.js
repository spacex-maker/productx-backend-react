import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import { sidebarReducer } from './sidebar';
import aiChatReducer from './aiChat';

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    user: userReducer,
    aiChat: aiChatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
