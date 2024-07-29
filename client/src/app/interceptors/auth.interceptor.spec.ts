import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthState } from '../state/auth.state';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authStateSpy: jasmine.SpyObj<AuthState>;

  beforeEach(() => {
    const authStateSpyObj = jasmine.createSpyObj('AuthState', ['user']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        { provide: AuthState, useValue: authStateSpyObj },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authStateSpy = TestBed.inject(AuthState) as jasmine.SpyObj<AuthState>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add an Authorization header', () => {
    authStateSpy.user.and.returnValue({
      username: 'testuser',
      token: 'testtoken',
      role: 'ROLE_USER',
      id: 'uuid-1',
    });

    httpClient
      .get('/api/data')
      .subscribe((response) => expect(response).toBeTruthy());

    const httpRequest = httpMock.expectOne('/api/data');
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Authorization')).toEqual(
      'Bearer testtoken'
    );
  });

  it('should not add an Authorization header when no user is logged in', () => {
    authStateSpy.user.and.returnValue(null);

    httpClient
      .get('/api/data')
      .subscribe((response) => expect(response).toBeTruthy());

    const httpRequest = httpMock.expectOne('/api/data');
    expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
  });
});
