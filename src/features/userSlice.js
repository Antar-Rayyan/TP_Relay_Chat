import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    token: '',
    loggedIn: false,
    error: ''
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.name = action.payload.username;
      state.token = action.payload.token;
      state.loggedIn = true;
      state.error = '';
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loggedIn = false;
    },
    logout: (state) => {
      state.name = '';
      state.token = '';
      state.loggedIn = false;
      state.error = '';
    },
  },
});

export const { loginSuccess, loginFailure, logout } = userSlice.actions;
export default userSlice.reducer;

