import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Auth } from '../auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
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

  constructor(private auth: Auth, private router: Router) {}

  onSignup() {

    this.auth.signup(this.signupData).subscribe({

      next: (res) => {

        console.log('Signup Response:', res);
        alert('Registration Successful');

        this.router.navigate(['/']);

      },

      error: (err) => {

        console.log('Error:', err);
        alert('Signup Failed - Check Console');

      }

    });

  }

}