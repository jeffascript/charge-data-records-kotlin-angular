import { Injectable, signal } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ChargeData } from '../models/charge-data.model';
import { BehaviorSubject } from 'rxjs';

export interface IChargeDataState {
  chargeData: ChargeData[];
  loading: boolean;
  error: string | null;
}

const initialState: IChargeDataState = {
  chargeData: [],
  loading: false,
  error: null,
};

export const ChargeDataStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setChargeData: (chargeData: ChargeData[]) =>
      patchState(store, (state) => ({ ...state, chargeData })),
    setLoading: (loading: boolean) =>
      patchState(store, (state) => ({ ...state, loading })),
    setError: (error: string | null) =>
      patchState(store, (state) => ({ ...state, error })),
  }))
);

@Injectable({ providedIn: 'root' })
export class ChargeDataState extends ChargeDataStore {
  private chargeDataSubject = new BehaviorSubject<ChargeData[]>([]);
  chargeData$ = this.chargeDataSubject.asObservable();

  setChargeDataRealTime(data: ChargeData[]) {
    this.setChargeData(data);
    this.chargeDataSubject.next(data);
  }
}
