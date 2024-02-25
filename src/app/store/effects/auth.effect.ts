// auth.effects.ts
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from '../actions/auth.action';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              token: response.token,
              user: {
                username: response.username,
                password: response.password,
              },
            })
          ),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );

  //   logout$ = createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(AuthActions.logout),
  //       mergeMap(() =>
  //         this.authService.logout().pipe(
  //           map(() => {
  //             // clear storage and state on successful logout
  //             localStorage.removeItem('token');
  //             return { type: '[No action]' }; // trigger re-evaluation of state
  //           }),
  //           catchError((error) => of(loginFailure({ error })))
  //         )
  //       )
  //     )
  //   );

  constructor(private actions$: Actions, private authService: AuthService) {}
}
