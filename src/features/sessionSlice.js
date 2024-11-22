import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    username: '',
    token: ''
  },
  reducers: {
    setSession(state, action) {
      return action.payload;
    },
    clearSession(state) {
      return { username: '', token: '' };
    }
  }
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
