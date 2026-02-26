import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  selector: 'app-watchman-login',
  templateUrl: './watchman-login.component.html',
  styleUrls: ['./watchman-login.component.css'],
  imports: [
    CommonModule,   // ✅ for *ngIf
    FormsModule     // ✅ for ngModel
  ]
})
export class WatchmanLoginComponent {

  username = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  login() {
    this.auth.loginWatchman(this.username, this.password).subscribe({
      next: () => {
        const redirect = this.route.snapshot.queryParamMap.get('redirect');
        this.router.navigateByUrl(redirect || '/attendance');
      },
      error: () => {
        this.error = 'Invalid credentials';
      }
    });
  }
}
