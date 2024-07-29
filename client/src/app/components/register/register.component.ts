import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthState } from '../../state/auth.state';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public authState: AuthState
  ) {
    // Redirect to home if already logged in
    if (this.authState.user()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: ['ROLE_USER', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(g: FormGroup) {
    const passwordControl = g.get('password');
    const confirmPasswordControl = g.get('confirmPassword');

    if (passwordControl?.value !== confirmPasswordControl?.value) {
      confirmPasswordControl?.setErrors({ mismatch: true });
    } else {
      confirmPasswordControl?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.authService
      .register(
        this.registerForm.value.username,
        this.registerForm.value.password,
        [this.registerForm.value.role]
      )
      .subscribe({
        next: () => {
          // Registration successful, redirect to login page
          this.router.navigate(['/login'], {
            queryParams: { registered: true },
          });
        },
        error: (error) => {
          console.error('Registration error', error);
          // You might want to display this error to the user

          const {
            error: { error: errorMessage },
          } = error;
          console.error('Login error', error);
          this.authState.setError(errorMessage);
        },
      });
  }
}
