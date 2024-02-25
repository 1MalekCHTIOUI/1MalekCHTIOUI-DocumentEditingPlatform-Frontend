import { createReducer, on } from '@ngrx/store';
import {
  loginSuccess,
  loginFailure,
  login,
  logout,
} from '../actions/auth.action';

export interface AuthState {
  token: string | null;
  user: any | null;
  loading: boolean;
  error: any | null;
}

export const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(login, (state) => ({ ...state, loading: true, error: null })),
  on(loginSuccess, (state, { token, user }) => ({
    ...state,
    token,
    user,
    loading: false,
    error: null,
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(logout, (state) => ({ ...initialState }))
);
