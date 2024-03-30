import { createReducer, on } from '@ngrx/store';
import * as DashboardActions from './../actions/dash.action';
import { DashState } from '../state/dash.state';

export const initialState: DashState = {
  loading: false,
};

export const dashboardReducer = createReducer(
  initialState,
  on(DashboardActions.startLoading, (state) => ({ ...state, loading: true })),
  on(DashboardActions.stopLoading, (state) => ({ ...state, loading: false }))
);
