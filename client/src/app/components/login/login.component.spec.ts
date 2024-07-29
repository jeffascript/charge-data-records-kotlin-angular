import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { AuthState } from '../../state/auth.state';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let authStateSpy: jasmine.SpyObj<AuthState>;

  beforeEach(async () => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['login']);
    const authStateSpyObj = jasmine.createSpyObj('AuthState', ['user']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: AuthState, useValue: authStateSpyObj },
      ],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authStateSpy = TestBed.inject(AuthState) as jasmine.SpyObj<AuthState>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form', () => {
    expect(component.loginForm.contains('username')).toBeTruthy();
    expect(component.loginForm.contains('password')).toBeTruthy();
  });

  it('should mark form as invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should mark form as valid when filled', () => {
    component.loginForm.setValue({
      username: 'testuser',
      password: 'password',
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call login method when form is submitted', () => {
    authServiceSpy.login.and.returnValue(
      of({
        username: 'testuser',
        token: 'testtoken',
        role: 'ROLE_USER',
        id: 'uuid-1',
      })
    );
    component.loginForm.setValue({
      username: 'testuser',
      password: 'password',
    });
    component.onSubmit();
    expect(authServiceSpy.login).toHaveBeenCalledWith('testuser', 'password');
  });
});
