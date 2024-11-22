import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    token: '',
    loggedIn: false,
    error: '',
    userList: [], // Nouvelle propriété pour stocker la liste des utilisateurs
    selectedUser: null // Utilisateur actuellement sélectionné
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
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    }
  },
});

export const { loginSuccess, loginFailure, logout, setUserList, selectUser } = userSlice.actions;
export default userSlice.reducer;
