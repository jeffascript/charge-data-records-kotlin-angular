import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { AuthState, IAuthState } from '../../state/auth.state';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let authStateMock: AuthState;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    const MockAuthStore = signalStore(
      withState<IAuthState>({
        user: null,
        loading: false,
        error: null,
        isServerAlive: true,
      }),
      withMethods((store) => ({
        setUser: (user: IAuthState['user']) => patchState(store, { user }),
        setLoading: (loading: boolean) => patchState(store, { loading }),
        setError: (error: string | null) => patchState(store, { error }),
        setServerStatus: (isServerAlive: boolean) =>
          patchState(store, { isServerAlive }),
        logout: () => patchState(store, { user: null }),
      }))
    );

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatToolbarModule, MatButtonModule],
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AuthState, useClass: MockAuthStore },
      ],
    }).compileComponents();

    authStateMock = TestBed.inject(AuthState);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show login and register buttons when user is not logged in', () => {
    authStateMock.setUser(null);
    authStateMock.setServerStatus(false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Login');
    expect(compiled.textContent).toContain('Register');
    expect(compiled.textContent).toContain(' ❌ Not Connected');
  });

  it('should show username when user is logged in', () => {
    authStateMock.setUser({ id: '1', username: 'testuser', token: 'token' });
    authStateMock.setServerStatus(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('testuser');
    expect(compiled.textContent).toContain(' ✅ Online and Connected');
  });

  it('should call logout when logout button is clicked', () => {
    authStateMock.setUser({ id: '1', username: 'testuser', token: 'token' });
    authStateMock.setServerStatus(true);
    fixture.detectChanges();
    const logoutButton =
      fixture.nativeElement.querySelector('button[mat-button]');
    logoutButton.click();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should show correct server status', () => {
    authStateMock.setUser(null);
    authStateMock.setServerStatus(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain(' ✅ Online and Connected');

    authStateMock.setServerStatus(false);
    fixture.detectChanges();
    expect(compiled.textContent).toContain(' ❌ Not Connected');
  });
});
