import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthState } from '../store/reducers/auth.reducer';
import { Store } from '@ngrx/store';
import {
  selectIsAuthenticated,
  selectIsLoggedIn,
  selectUser,
} from '../store/selectors/auth.selector';
import { take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AuthState>
  ) {}

  canActivate(): any {
    return this.store.select(selectIsLoggedIn).pipe(
      tap((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
