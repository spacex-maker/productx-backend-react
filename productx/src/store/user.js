import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: {
    id: null,
    username: null,
    email: null,
    phone: null,
    roleId: null,
    status: null,
    isDeleted: false,
    thirdUserAccountId: null,
    createBy: null,
    avatar: null,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = initialState.currentUser;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
