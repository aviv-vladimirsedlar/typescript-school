import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "../../features/users/users.types";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user: User }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
