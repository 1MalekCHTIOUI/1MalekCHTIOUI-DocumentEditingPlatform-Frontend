import { createSelector, createFeatureSelector } from '@ngrx/store';
import { initialState } from '../reducers/dash.reducer';
import { DashState } from '../state/dash.state';

export const selectDashboardState =
  createFeatureSelector<DashState>('dashboard');

export const selectLoading = createSelector(
  selectDashboardState,
  (state: DashState) => state.loading
);
