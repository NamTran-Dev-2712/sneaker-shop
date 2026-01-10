import type { LoginResponse } from "~/services/auth/dto/login/login.response";

export interface AuthState {
  isLogin: boolean;
  user: LoginResponse | null;
}

export const initialState: AuthState = {
  isLogin: false,
  user: null,
};
