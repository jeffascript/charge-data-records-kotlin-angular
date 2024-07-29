import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { AuthState } from '../../state/auth.state';
import { of, throwError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authState: AuthState;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        AuthState, // Use the real AuthState
      ],
    }).compileComponents();

    authState = TestBed.inject(AuthState);
    spyOn(authState, 'setError'); // Spy on the setError method
    spyOn(authState, 'user').and.returnValue(null); // Spy on the user method
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.contains('username')).toBeTruthy();
    expect(component.registerForm.contains('password')).toBeTruthy();
    expect(component.registerForm.contains('confirmPassword')).toBeTruthy();
    expect(component.registerForm.contains('role')).toBeTruthy();
  });

  it('should validate form inputs', () => {
    const form = component.registerForm;
    expect(form.valid).toBeFalsy();

    form.patchValue({
      username: 'test',
      password: 'password',
      confirmPassword: 'password',
      role: 'ROLE_USER',
    });

    expect(form.valid).toBeTruthy();
  });

  it('should call register service on valid form submission', () => {
    authServiceSpy.register.and.returnValue(of({}));

    component.registerForm.patchValue({
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'ROLE_USER',
    });

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith(
      'testuser',
      'password123',
      ['ROLE_USER']
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { registered: true },
    });
  });

  it('should handle registration error', () => {
    const errorResponse = { error: { error: 'Registration failed' } };
    authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.registerForm.patchValue({
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'ROLE_USER',
    });

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith(
      'testuser',
      'password123',
      ['ROLE_USER']
    );
    expect(authState.setError).toHaveBeenCalledWith('Registration failed');
  });
});
