import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ChargeData } from '../models/charge-data.model';
import { ChargeDataState } from '../state/charge-data.state';
import { AuthState } from '../state/auth.state';
import { MOCK_CHARGE_DATA } from '../mock-data/charge-data.mock';
import { HttpService } from './http.service';
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class ChargeDataService {
  private apiUrl = API_ENDPOINTS.CHARGE_DATA;

  constructor(
    private httpService: HttpService,
    private chargeDataState: ChargeDataState,
    private authState: AuthState
  ) {
    this.initializeOfflineData();
  }

  private initializeOfflineData() {
    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.CHARGE_DATA)) {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.CHARGE_DATA,
        JSON.stringify(MOCK_CHARGE_DATA)
      );
    }
  }

  getChargeData(): Observable<ChargeData[]> {
    this.chargeDataState.setLoading(true);

    if (!this.authState.isServerAlive()) {
      return this.getOfflineChargeData();
    }

    return this.httpService.get<ChargeData[]>(this.apiUrl).pipe(
      tap({
        next: (data) => {
          this.chargeDataState.setChargeData(data);
          this.chargeDataState.setLoading(false);
        },
        error: (error) => {
          this.chargeDataState.setError(error.message);
          this.chargeDataState.setLoading(false);
        },
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          // The backend is not available, use mock data
          return this.getOfflineChargeData();
        }
        throw error;
      })
    );
  }

  getOfflineChargeData(): Observable<ChargeData[]> {
    const storedData = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.CHARGE_DATA) || '[]'
    );
    this.chargeDataState.setChargeData(storedData);
    this.chargeDataState.setLoading(false);
    return of(storedData);
  }

  createOfflineChargeData(data: ChargeData): Observable<ChargeData> {
    const storedData = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.CHARGE_DATA) || '[]'
    );

    storedData.push(data);
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.CHARGE_DATA,
      JSON.stringify(storedData)
    );
    this.chargeDataState.setChargeData(storedData);
    this.chargeDataState.setChargeDataRealTime(storedData);
    this.chargeDataState.setLoading(false);
    return of(data);
  }

  createChargeData(data: ChargeData): Observable<ChargeData> {
    this.chargeDataState.setLoading(true);
    if (!this.authState.isServerAlive()) {
      return this.createOfflineChargeData(data);
    }
    return this.httpService.post<ChargeData>(this.apiUrl, data).pipe(
      tap({
        next: (newData) => {
          const currentData = this.chargeDataState.chargeData();
          this.chargeDataState.setChargeData([...currentData, newData]);
          this.chargeDataState.setChargeDataRealTime([...currentData, newData]);
          this.chargeDataState.setLoading(false);
        },
        error: (error) => {
          this.chargeDataState.setError(error);
          this.chargeDataState.setLoading(false);
        },
      })
    );
  }
}
