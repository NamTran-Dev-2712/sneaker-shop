import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./auth.state";
import type { LoginResponse } from "~/services/auth/dto/login/login.response";

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginResponse>) => {
      state.isLogin = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLogin = false;
      state.user = null;
    },
    updateCartItemCount: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.cartItemCount = action.payload;
      }
    },
  },
});

export const { login, logout, updateCartItemCount } = AuthSlice.actions;
export default AuthSlice.reducer;
