import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isFloatingVisible: false,
  floatingPosition: {
    x: window.innerWidth - 450, // 默认放在右侧
    y: 100 // 距离顶部100px
  }
};

const aiChatSlice = createSlice({
  name: 'aiChat',
  initialState,
  reducers: {
    toggleFloating: (state, action) => {
      state.isFloatingVisible = action.payload;
    },
    updateFloatingPosition: (state, action) => {
      state.floatingPosition = action.payload;
    }
  }
});

export const { toggleFloating, updateFloatingPosition } = aiChatSlice.actions;
export default aiChatSlice.reducer; 