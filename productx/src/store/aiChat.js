import { createSlice } from '@reduxjs/toolkit';

const aiChatSlice = createSlice({
  name: 'aiChat',
  initialState: {
    isFloatingVisible: false,
  },
  reducers: {
    toggleFloating: (state, action) => {
      state.isFloatingVisible = action.payload;
    },
  },
});

export const { toggleFloating } = aiChatSlice.actions;
export default aiChatSlice.reducer; 