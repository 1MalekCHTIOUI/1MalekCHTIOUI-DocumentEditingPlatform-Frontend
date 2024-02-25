import { createAction, props } from '@ngrx/store';
export enum AuthActionTypes {
  Login = '[Auth] Login',
  LoginSuccess = '[Auth] Login Success',
  LoginFailure = '[Auth] Login Failure',
  Logout = '[Auth] Logout',
}

export const login = createAction(
  AuthActionTypes.Login,
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  AuthActionTypes.LoginSuccess,
  props<{ token: string; user: any }>()
);

export const loginFailure = createAction(
  AuthActionTypes.LoginFailure,
  props<{ error: any }>()
);

export const logout = createAction(AuthActionTypes.Logout);
