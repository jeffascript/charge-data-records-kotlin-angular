import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChargeDataTableComponent } from './charge-data-table.component';
import { ChargeDataService } from '../../services/charge-data.service';
import {
  ChargeDataState,
  IChargeDataState,
} from '../../state/charge-data.state';
import { AuthService } from '../../services/auth.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, BehaviorSubject } from 'rxjs';
import { ChargeData } from '../../models/charge-data.model';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

describe('ChargeDataTableComponent', () => {
  let component: ChargeDataTableComponent;
  let fixture: ComponentFixture<ChargeDataTableComponent>;
  let chargeDataServiceSpy: jasmine.SpyObj<ChargeDataService>;
  let chargeDataStateMock: ChargeDataState;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let chargeDataSubject: BehaviorSubject<ChargeData[]>;

  beforeEach(async () => {
    chargeDataServiceSpy = jasmine.createSpyObj('ChargeDataService', [
      'getChargeData',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAdmin']);

    chargeDataSubject = new BehaviorSubject<ChargeData[]>([]);

    const MockChargeDataStore = signalStore(
      withState<IChargeDataState>({
        chargeData: [],
        loading: false,
        error: null,
      }),
      withMethods((store) => ({
        setChargeData: (chargeData: ChargeData[]) =>
          patchState(store, (state) => ({ ...state, chargeData })),
        setLoading: (loading: boolean) =>
          patchState(store, (state) => ({ ...state, loading })),
        setError: (error: string | null) =>
          patchState(store, (state) => ({ ...state, error })),
      }))
    );

    class MockChargeDataState extends MockChargeDataStore {
      chargeData$ = chargeDataSubject.asObservable();

      setChargeDataRealTime(data: ChargeData[]) {
        this.setChargeData(data);
        chargeDataSubject.next(data);
      }
    }

    chargeDataStateMock = new MockChargeDataState() as ChargeDataState;

    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      declarations: [ChargeDataTableComponent],
      providers: [
        { provide: ChargeDataService, useValue: chargeDataServiceSpy },
        { provide: ChargeDataState, useValue: chargeDataStateMock },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    chargeDataServiceSpy.getChargeData.and.returnValue(of([]));
    authServiceSpy.isAdmin.and.returnValue(false);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeDataTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load charge data on init', () => {
    const mockData: ChargeData[] = [
      {
        chargingSessionId: '1',
        vehicleId: 'v1',
        startTime: '2023-01-01',
        endTime: '2023-01-02',
        totalCost: 10,
      },
    ];
    chargeDataServiceSpy.getChargeData.and.returnValue(of(mockData));
    chargeDataStateMock.setChargeDataRealTime(mockData);

    fixture.detectChanges();

    expect(chargeDataServiceSpy.getChargeData).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockData);
  });

  it('should filter data when applyFilter is called', () => {
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
    chargeDataServiceSpy.getChargeData.and.returnValue(of(mockData));
    chargeDataStateMock.setChargeDataRealTime(mockData);

    fixture.detectChanges();

    const event = { target: { value: 'v2' } } as any;
    component.applyFilter(event);

    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].chargingSessionId).toBe('2');
  });

  it('should reload data when chargeData$ emits', () => {
    const initialData: ChargeData[] = [
      {
        chargingSessionId: '1',
        vehicleId: 'v1',
        startTime: '2023-01-01',
        endTime: '2023-01-02',
        totalCost: 10,
      },
    ];
    const newData: ChargeData[] = [
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

    chargeDataServiceSpy.getChargeData.and.returnValue(of(initialData));
    chargeDataStateMock.setChargeDataRealTime(initialData);

    fixture.detectChanges();

    expect(component.dataSource.data).toEqual(initialData);

    chargeDataServiceSpy.getChargeData.and.returnValue(of(newData));
    chargeDataStateMock.setChargeDataRealTime(newData);

    expect(chargeDataServiceSpy.getChargeData).toHaveBeenCalledTimes(3);
    expect(component.dataSource.data).toEqual(newData);
  });
});
