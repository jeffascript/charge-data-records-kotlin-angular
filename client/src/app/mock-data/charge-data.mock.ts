import { ChargeData } from '../models/charge-data.model';

export const MOCK_CHARGE_DATA: ChargeData[] = [
  {
    chargingSessionId: 'session-1',
    vehicleId: 'vehicle-1',
    startTime: '2023-05-01T10:00:00',
    endTime: '2023-05-01T12:30:00',
    totalCost: 25.99,
  },
  {
    chargingSessionId: 'session-2',
    vehicleId: 'vehicle-2',
    startTime: '2023-05-02T14:15:00',
    endTime: '2023-05-02T16:45:00',
    totalCost: 18.75,
  },
  {
    chargingSessionId: 'session-3',
    vehicleId: 'vehicle-1',
    startTime: '2023-05-03T09:30:00',
    endTime: '2023-05-03T11:00:00',
    totalCost: 12.5,
  },
  {
    chargingSessionId: 'session-4',
    vehicleId: 'vehicle-3',
    startTime: '2023-05-04T08:00:00',
    endTime: '2023-05-04T10:15:00',
    totalCost: 20.0,
  },
];

export const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'password',
    roles: ['ROLE_ADMIN'],
    token: 'fake-jwt-token-admin',
  },
  {
    id: '2',
    username: 'user',
    password: 'password',
    roles: ['ROLE_USER'],
    token: 'fake-jwt-token-user',
  },
];
