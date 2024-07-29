import { TestBed } from '@angular/core/testing';
import { ChargeDataState } from './charge-data.state';
import { ChargeData } from '../models/charge-data.model';

describe('ChargeDataState', () => {
  let state: ChargeDataState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChargeDataState],
    });
    state = TestBed.inject(ChargeDataState);
  });

  it('should be created', () => {
    expect(state).toBeTruthy();
  });

  it('should set and get charge data', () => {
    const mockData: ChargeData[] = [
      {
        chargingSessionId: '1',
        vehicleId: 'v1',
        startTime: '2023-01-01',
        endTime: '2023-01-02',
        totalCost: 10,
      },
      {
        chargingSessionId: '2',
        vehicleId: 'v2',
        startTime: '2023-01-03',
        endTime: '2023-01-04',
        totalCost: 20,
      },
    ];
    state.setChargeData(mockData);
    expect(state.chargeData()).toEqual(mockData);
  });

  it('should set and get loading state', () => {
    state.setLoading(true);
    expect(state.loading()).toBeTrue();
    state.setLoading(false);
    expect(state.loading()).toBeFalse();
  });

  it('should set and get error', () => {
    const errorMessage = 'Test error';
    state.setError(errorMessage);
    expect(state.error()).toEqual(errorMessage);
  });
});
