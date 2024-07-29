import { TestBed } from '@angular/core/testing';
import { ChargeDataService } from './charge-data.service';
import { ChargeDataState } from '../state/charge-data.state';
import { AuthState } from '../state/auth.state';
import { HttpService } from './http.service';
import { of } from 'rxjs';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // Increase timeout to 10 seconds

describe('ChargeDataService', () => {
  let service: ChargeDataService;
  let chargeDataStateSpy: jasmine.SpyObj<ChargeDataState>;
  let authStateSpy: jasmine.SpyObj<AuthState>;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    const chargeDataStateSpyObj = jasmine.createSpyObj('ChargeDataState', [
      'setChargeData',
      'setLoading',
      'setError',
      'chargeData',
      'setChargeDataRealTime',
    ]);
    const authStateSpyObj = jasmine.createSpyObj('AuthState', [
      'isServerAlive',
    ]);
    const httpServiceSpyObj = jasmine.createSpyObj('HttpService', [
      'get',
      'post',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ChargeDataService,
        { provide: ChargeDataState, useValue: chargeDataStateSpyObj },
        { provide: AuthState, useValue: authStateSpyObj },
        { provide: HttpService, useValue: httpServiceSpyObj },
      ],
    });

    service = TestBed.inject(ChargeDataService);
    chargeDataStateSpy = TestBed.inject(
      ChargeDataState
    ) as jasmine.SpyObj<ChargeDataState>;
    authStateSpy = TestBed.inject(AuthState) as jasmine.SpyObj<AuthState>;
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get charge data when server is alive', (done) => {
    const mockData = [
      {
        chargingSessionId: '1',
        vehicleId: 'v1',
        startTime: '2023-01-01',
        endTime: '2023-01-02',
        totalCost: 10,
      },
    ];
    authStateSpy.isServerAlive.and.returnValue(true);
    httpServiceSpy.get.and.returnValue(of(mockData));

    service.getChargeData().subscribe((data) => {
      expect(data).toEqual(mockData);
      expect(chargeDataStateSpy.setChargeData).toHaveBeenCalledWith(mockData);
      expect(chargeDataStateSpy.setLoading).toHaveBeenCalledWith(false);
      done();
    });
  });

  it('should get offline charge data when server is not alive', (done) => {
    const mockData = [
      {
        chargingSessionId: '1',
        vehicleId: 'v1',
        startTime: '2023-01-01',
        endTime: '2023-01-02',
        totalCost: 10,
      },
    ];
    authStateSpy.isServerAlive.and.returnValue(false);
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockData));

    service.getChargeData().subscribe((data) => {
      expect(data).toEqual(mockData);
      expect(chargeDataStateSpy.setChargeData).toHaveBeenCalledWith(mockData);
      expect(chargeDataStateSpy.setLoading).toHaveBeenCalledWith(false);
      done();
    });
  });

  it('should create charge data when server is alive', (done) => {
    const newData = {
      chargingSessionId: '2',
      vehicleId: 'v2',
      startTime: '2023-01-03',
      endTime: '2023-01-04',
      totalCost: 20,
    };
    authStateSpy.isServerAlive.and.returnValue(true);
    httpServiceSpy.post.and.returnValue(of(newData));
    chargeDataStateSpy.chargeData.and.returnValue([]);

    service.createChargeData(newData).subscribe((data) => {
      expect(data).toEqual(newData);
      expect(chargeDataStateSpy.setChargeData).toHaveBeenCalled();
      expect(chargeDataStateSpy.setLoading).toHaveBeenCalledWith(false);
      done();
    });
  });

  it('should create offline charge data when server is not alive', (done) => {
    const newData = {
      chargingSessionId: 'session-1',
      vehicleId: 'v2',
      startTime: '2023-01-03',
      endTime: '2023-01-04',
      totalCost: 20,
    };
    authStateSpy.isServerAlive.and.returnValue(false);
    spyOn(localStorage, 'getItem').and.returnValue('[]');
    spyOn(localStorage, 'setItem');

    service.createChargeData(newData).subscribe((data) => {
      expect(data).toEqual(jasmine.objectContaining(newData));
      expect(chargeDataStateSpy.setChargeData).toHaveBeenCalled();
      expect(chargeDataStateSpy.setChargeDataRealTime).toHaveBeenCalled();
      expect(chargeDataStateSpy.setLoading).toHaveBeenCalledWith(false);
      expect(localStorage.setItem).toHaveBeenCalled();
      done();
    });
  });
});
