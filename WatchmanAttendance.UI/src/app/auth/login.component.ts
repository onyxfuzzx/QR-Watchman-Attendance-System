import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true, 
  imports: [FormsModule, CommonModule] 

})
export class LoginComponent {

  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  login() {
    this.api.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);

        const payload = JSON.parse(atob(res.token.split('.')[1]));
        const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        if (role === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/watchman/dashboard']);
        }
      },
      error: err => {
        this.error = err.error || 'Login failed';
      }
    });
  }
}
