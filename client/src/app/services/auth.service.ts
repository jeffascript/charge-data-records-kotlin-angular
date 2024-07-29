import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthState, User } from '../state/auth.state';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { ServerStatusService } from './server-status.service';
import { MOCK_USERS } from '../mock-data/charge-data.mock';
import { HttpService } from './http.service';
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpService: HttpService,
    private authState: AuthState,
    private serverStatusService: ServerStatusService
  ) {
    this.checkServerStatus();
    this.initializeOfflineUsers();
    // Check local storage for existing user on service initialization
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    if (storedUser) {
      this.authState.setUser(JSON.parse(storedUser));
    }
  }

  private initializeOfflineUsers() {
    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USERS)) {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.USERS,
        JSON.stringify(MOCK_USERS)
      );
    }
  }

  checkServerStatus() {
    this.serverStatusService
      .checkServerStatus()
      .subscribe((isAlive) => this.authState.setServerStatus(isAlive));
  }

  login(username: string, password: string): Observable<User> {
    this.authState.setLoading(true);

    if (!this.authState.isServerAlive()) {
      return this.offlineLogin(username, password) as Observable<User>;
    }

    return this.httpService
      .post<User>(API_ENDPOINTS.LOGIN, { username, password })
      .pipe(
        tap({
          next: (response) => {
            const decodedToken = jwtDecode<{ sub: string; roles: string[] }>(
              response.token
            );

            localStorage.setItem(
              LOCAL_STORAGE_KEYS.CURRENT_USER,
              JSON.stringify({
                username: decodedToken.sub || username,
                token: response.token,
                role: decodedToken.roles[0],
              })
            );
            this.authState.setUser({
              username,
              token: response.token,
              role: decodedToken.roles[0],
            } as User);
            this.authState.setLoading(false);
          },
          error: (error) => {
            this.authState.setError(error.error);
            this.authState.setLoading(false);
          },
        })
      );
  }

  offlineLogin(username: string, password: string): Observable<User | null> {
    const users = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.USERS) || '[]'
    );
    const foundUser = users.find(
      (user: { username: string; password: string }) =>
        user.username === username && user.password === password
    );
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(userWithoutPassword)
      );
      this.authState.setUser(userWithoutPassword);
      this.authState.setLoading(false);
      return of(foundUser);
    } else {
      this.authState.setError('Invalid username or password');
      this.authState.setLoading(false);
      return of(null);
    }
  }

  offlineRegister(
    username: string,
    password: string,
    role: string = 'ROLE_USER'
  ): Observable<{ message: string } | null> {
    const storedUsers = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.USERS) || '[]'
    );
    if (storedUsers.some((u: User) => u.username === username)) {
      this.authState.setError('Username already exists');
      this.authState.setLoading(false);
      return of(null);
    }
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      username,
      password,
      role,
      token: 'fake-jwt-token',
    };
    storedUsers.push(newUser);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(storedUsers));
    this.authState.setLoading(false);
    return of({ message: 'Registration successful' });
  }

  register(
    username: string,
    password: string,
    role: string[]
  ): Observable<any> {
    this.authState.setLoading(true);
    const userData = {
      username,
      password,
      roles: role ?? ['ROLE_USER'],
    };

    if (!this.authState.isServerAlive()) {
      return this.offlineRegister(username, password, role[0]);
    }

    return this.httpService.post<any>(API_ENDPOINTS.REGISTER, userData).pipe(
      tap({
        next: () => this.authState.setLoading(false),
        error: ({ error }) => {
          this.authState.setError(error.error);
          this.authState.setLoading(false);
        },
      })
    );
  }

  logout() {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    this.authState.logout();
  }

  get currentUserValue(): User | null {
    const userJson = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    return userJson ? JSON.parse(userJson) : null;
  }

  isAdmin(): boolean {
    return this.authState.user()?.role === 'ROLE_ADMIN' || false;
  }
}
