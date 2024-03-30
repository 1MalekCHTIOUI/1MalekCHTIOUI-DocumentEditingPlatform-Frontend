import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { startLoading, stopLoading } from '../actions/dash.action';

@Injectable()
export class DashboardEffects {
  constructor(private actions$: Actions) {}

  loadData$ = this.actions$.pipe(
    ofType('[Dashboard] Load Data'),
    map(() => startLoading())
  );

  loadDataSuccess$ = this.actions$.pipe(
    ofType('[Dashboard] Load Data Success'),
    map(() => stopLoading())
  );

  loadDataFailure$ = this.actions$.pipe(
    ofType('[Dashboard] Load Data Failure'),
    map(() => stopLoading())
  );
}
