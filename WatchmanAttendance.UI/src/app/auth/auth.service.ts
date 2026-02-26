import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { APP_CONFIG } from '../config/app-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = APP_CONFIG.apiUrl;

  constructor(private http: HttpClient) { }
  get token(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }
  loginAdmin(username: string, password: string) {
    return this.http.post<any>(
      `${this.baseUrl}/auth/admin/login`,
      { username, password }
    ).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', 'Admin');
      })
    );
  }
  getRole(): 'Admin' | 'Watchman' | null {
    if (!this.token) return null;

    const payload = JSON.parse(atob(this.token.split('.')[1]));

    // .NET default role claim
    const msRole =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    // Custom role claim (if added later)
    const simpleRole = payload['role'];

    return msRole || simpleRole || null;
  }

  loginWatchman(username: string, password: string) {
    return this.http.post<any>(
      `${this.baseUrl}/auth/watchman/login`,
      { username, password }
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', 'Watchman');
      })
    );
  }
  

}
