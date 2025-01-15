import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: 'signup.component.html',
styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the form in the constructor
    this.signupForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.loading = true;
      this.error = '';
      
      const { email, password } = this.signupForm.getRawValue();
      
      this.authService.signup(email, password).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.error = err.error.message || 'Signup failed';
          this.loading = false;
        }
      });
    }
  }
}

