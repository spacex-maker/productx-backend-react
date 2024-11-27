import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false
};

const sidebarReducer = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarShow: !state.sidebarShow };
    case 'TOGGLE_UNFOLDABLE':
      return { ...state, sidebarUnfoldable: !state.sidebarUnfoldable };
    default:
      return state;
  }
};

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