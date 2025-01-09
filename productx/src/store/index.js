import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import { sidebarReducer } from './sidebar';

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
