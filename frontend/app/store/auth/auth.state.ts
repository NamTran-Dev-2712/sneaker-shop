export interface AuthState {
  isLogin: boolean;
  user: null;
}

export const initialState: AuthState = {
  isLogin: false,
  user: null,
};
