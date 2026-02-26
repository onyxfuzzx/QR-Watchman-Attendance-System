import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  selector: 'app-admin-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';
  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) { }

  login() {
    this.loading = true;
    this.error = '';

    this.api.adminLogin({ username: this.username, password: this.password })
      .subscribe({
        next: (res: any) => {
          this.auth.setToken(res.token);
          this.router.navigate(['/admin/dashboard']);
        },
        error: () => {
          this.error = 'Invalid credentials';
          this.loading = false;
        }
      });
  }
}
