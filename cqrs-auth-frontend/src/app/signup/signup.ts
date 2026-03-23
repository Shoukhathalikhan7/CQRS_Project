import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Auth } from '../auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
     MatSnackBarModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  signupData = {
    username: '',
    email: '',
    password: ''
  };

  constructor(private auth: Auth, private router: Router, private snackBar: MatSnackBar) {}
  showError(message: string) {

  this.snackBar.open(message, 'Close', {
    duration: 4000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['error-snackbar']
  });

}

onSignup() {

  const password = this.signupData.password;

  if (!/[a-z]/.test(password)) {
    this.showError('Password must contain at least one lowercase letter');
    return;
  }

  if (!/[A-Z]/.test(password)) {
    this.showError('Password must contain at least one uppercase letter');
    return;
  }

  if (!/[0-9]/.test(password)) {
    this.showError('Password must contain at least one number');
    return;
  }

  if (!/[@$!%*?&]/.test(password)) {
    this.showError('Password must contain at least one special character');
    return;
  }

  if (password.length < 8) {
    this.showError('Password must be at least 8 characters long');
    return;
  }

  this.auth.signup(this.signupData).subscribe({

    next: () => {

      this.snackBar.open('Registration Successful', 'Close', {
        duration: 3000
      });

      this.router.navigate(['/']);

    },

    error: () => {

      this.showError('Signup Failed');

    }

  });

}

}