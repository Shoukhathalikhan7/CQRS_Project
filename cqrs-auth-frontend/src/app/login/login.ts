import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginData = {
    email: '',
    password: ''
  };

  constructor(private auth: Auth, private router: Router) {}

  login() {

    this.auth.login(this.loginData).subscribe({

      next: (res: any) => {

        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);

        if (res.role === 'Admin') {
          this.router.navigate(['/users']);
        } else {
          this.router.navigate(['/dashboard']);
        }

      },

      error: () => {
        alert("Invalid Credentials");
      }

    });

  }

}