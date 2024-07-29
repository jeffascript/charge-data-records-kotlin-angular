import { TestBed } from '@angular/core/testing';
import { AuthState } from './auth.state';

describe('AuthState', () => {
  let state: AuthState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthState],
    });
    state = TestBed.inject(AuthState);
  });

  it('should be created', () => {
    expect(state).toBeTruthy();
  });

  it('should set and get user', () => {
    const mockUser = {
      username: 'testuser',
      token: 'testtoken',
      role: 'ROLE_USER',
      id: 'uuid-1',
    };
    state.setUser(mockUser);
    expect(state.user()).toEqual(mockUser);
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

  it('should set and get server status', () => {
    state.setServerStatus(true);
    expect(state.isServerAlive()).toBeTrue();
    state.setServerStatus(false);
    expect(state.isServerAlive()).toBeFalse();
  });

  it('should reset state on logout', () => {
    state.setUser({
      username: 'testuser',
      token: 'testtoken',
      role: 'ROLE_USER',
      id: 'uuid-1',
    });
    state.setLoading(true);
    state.setError('Test error');
    state.setServerStatus(true);

    state.logout();

    expect(state.user()).toBeNull();
    expect(state.loading()).toBeFalse();
    expect(state.error()).toBeNull();
    expect(state.isServerAlive()).toBeTrue(); // Server status should remain unchanged after logout
  });
});
