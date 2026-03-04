import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
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

      // Save token
      localStorage.setItem('token', res.token);

      // Save role
      localStorage.setItem('role', res.role);

      // Redirect based on role
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