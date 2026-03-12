import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const redirect = this.getRedirectUrl();

    // If already logged in, use redirect target first, then fallback by role
    if (this.auth.isLoggedIn()) {
      if (redirect) {
        this.router.navigateByUrl(redirect);
        return;
      }

      const role = this.auth.getRole();
      if (role === 'Admin') {
        this.router.navigate(['/admin/dashboard']);
      } else if (role === 'Watchman') {
        this.router.navigate(['/watchman/dashboard']);
      }
    }
  }

  login() {
    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Please enter username and password';
      return;
    }

    this.loading = true;
    this.error = '';

    this.api.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);

        const payload = JSON.parse(atob(res.token.split('.')[1]));
        const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const redirect = this.getRedirectUrl();

        if (role === 'Admin') {
          localStorage.setItem('role', 'Admin');
          this.router.navigateByUrl(redirect || '/admin/dashboard');
        } else {
          localStorage.setItem('role', 'Watchman');
          this.router.navigateByUrl(redirect || '/watchman/dashboard');
        }
      },
      error: err => {
        this.loading = false;
        this.error = typeof err?.error === 'string' ? err.error : 'Invalid credentials';
      }
    });
  }

  private getRedirectUrl(): string | null {
    return this.route.snapshot.queryParamMap.get('redirect');
  }
}
