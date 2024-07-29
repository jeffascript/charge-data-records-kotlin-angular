import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AuthState } from '../state/auth.state';
import { ServerStatusService } from './server-status.service';
import { HttpService } from './http.service';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let authStateSpy: jasmine.SpyObj<AuthState>;
  let serverStatusServiceSpy: jasmine.SpyObj<ServerStatusService>;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    const authStateSpyObj = jasmine.createSpyObj('AuthState', [
      'setUser',
      'setLoading',
      'setError',
      'setServerStatus',
      'logout',
      'isServerAlive',
      'user',
    ]);
    const serverStatusServiceSpyObj = jasmine.createSpyObj(
      'ServerStatusService',
      ['checkServerStatus']
    );
    const httpServiceSpyObj = jasmine.createSpyObj('HttpService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AuthState, useValue: authStateSpyObj },
        { provide: ServerStatusService, useValue: serverStatusServiceSpyObj },
        { provide: HttpService, useValue: httpServiceSpyObj },
      ],
    });

    authStateSpy = TestBed.inject(AuthState) as jasmine.SpyObj<AuthState>;
    serverStatusServiceSpy = TestBed.inject(
      ServerStatusService
    ) as jasmine.SpyObj<ServerStatusService>;
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;

    // Initialize spies
    serverStatusServiceSpy.checkServerStatus.and.returnValue(of(true));
    httpServiceSpy.post.and.returnValue(of({}));
    authStateSpy.isServerAlive.and.returnValue(true);
    authStateSpy.user.and.returnValue(null);

    // Spy on localStorage
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
  });

  it('should be created', fakeAsync(() => {
    service = TestBed.inject(AuthService);
    tick();
    expect(service).toBeTruthy();
  }));

  it('should login user when server is alive', fakeAsync(() => {
    const mockUser = {
      username: 'testuser',
      token:
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiaWF0IjoxNzE5NzA2NDI2LCJleHAiOjE3MTk3OTI4MjZ9.ZJp0M0SiTKlXO4rdBp1M74zOqOcm9JGR2TycMXIQBrs7JK5jNHVqk2-zmBUUntgpLTKPXHW41DvdyvqjsjmdMw', // Replace with a valid JWT token
      role: 'ROLE_ADMIN',
      id: 'uuid-1',
    };
    httpServiceSpy.post.and.returnValue(of(mockUser));

    service = TestBed.inject(AuthService);
    tick();

    let result: any;
    service.login('testuser', 'password').subscribe(
      (user) => (result = user),
      (error) => fail(`Login failed: ${error}`)
    );

    tick();
    expect(result).toEqual(mockUser);
    const { id, ...mocksWithoutId } = mockUser;
    expect(authStateSpy.setUser).toHaveBeenCalledWith(mocksWithoutId as any);
    expect(authStateSpy.setLoading).toHaveBeenCalledWith(false);
  }));

  it('should register user when server is alive', fakeAsync(() => {
    const mockResponse = { message: 'Registration successful' };
    httpServiceSpy.post.and.returnValue(of(mockResponse));

    service = TestBed.inject(AuthService);
    tick();

    let result: any;
    service.register('testuser', 'password', ['ROLE_USER']).subscribe(
      (response) => (result = response),
      (error) => fail(`Registration failed: ${error}`)
    );

    tick();

    expect(result).toEqual(mockResponse);
    expect(authStateSpy.setLoading).toHaveBeenCalledWith(false);
  }));

  it('should register user offline when server is not alive', fakeAsync(() => {
    authStateSpy.isServerAlive.and.returnValue(false);
    (localStorage.getItem as jasmine.Spy).and.returnValue('[]');

    service = TestBed.inject(AuthService);
    tick();

    let result: any;
    service.register('testuser', 'password', ['ROLE_USER']).subscribe(
      (response) => (result = response),
      (error) => fail(`Offline registration failed: ${error}`)
    );

    tick();

    expect(result).toEqual({ message: 'Registration successful' });
    expect(authStateSpy.setLoading).toHaveBeenCalledWith(false);
    expect(localStorage.setItem).toHaveBeenCalled();
  }));

  it('should logout user', fakeAsync(() => {
    service = TestBed.inject(AuthService);
    tick();

    service.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser');
    expect(authStateSpy.logout).toHaveBeenCalled();
  }));

  it('should check if user is admin', fakeAsync(() => {
    service = TestBed.inject(AuthService);
    tick();

    authStateSpy.user.and.returnValue({
      username: 'testuser',
      token: 'testtoken',
      role: 'ROLE_ADMIN',
      id: 'uuid-1',
    });
    expect(service.isAdmin()).toBeTrue();

    authStateSpy.user.and.returnValue({
      username: 'testuser',
      token: 'testtoken',
      role: 'ROLE_USER',
      id: 'uuid-1',
    });
    expect(service.isAdmin()).toBeFalse();
  }));
});
