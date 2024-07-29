import { Injectable, signal } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export interface User {
  id: string;
  username: string;
  token: string;
  role?: string;
}

export interface IAuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isServerAlive: boolean;
}

const initialState: IAuthState = {
  user: null,
  loading: false,
  error: null,
  isServerAlive: true,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setUser: (user: User | null) =>
      // 👇 Updating store state using the `patchState` function.
      patchState(store, (state) => ({ ...state, user })),
    setLoading: (loading: boolean) =>
      patchState(store, (state) => ({ ...state, loading })),
    setError: (error: string | null) =>
      patchState(store, (state) => ({ ...state, error })),
    setServerStatus: (isServerAlive: boolean) =>
      patchState(store, (state) => ({ ...state, isServerAlive })),
    logout: () =>
      patchState(store, () => ({
        ...initialState,
        isServerAlive: store.isServerAlive(),
      })),
  }))
);

@Injectable({ providedIn: 'root' })
export class AuthState extends AuthStore {}
