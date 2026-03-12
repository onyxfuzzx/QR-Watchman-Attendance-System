import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-scan',
  imports: [CommonModule],
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit, OnDestroy {

  status: 'loading' | 'success' | 'error' = 'loading';
  message = '';
  private redirectTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');

    if (!token) {
      this.status = 'error';
      this.message = 'Invalid QR code';
      return;
    }

    this.validateQr(token);
  }

  ngOnDestroy(): void {
    if (this.redirectTimeoutId) {
      clearTimeout(this.redirectTimeoutId);
    }
  }

  validateQr(token: string) {
    this.api.validateQr(token).subscribe({
      next: (res: any) => {
        // Save locationId for attendance
        //localStorage.setItem('locationId', res.locationId);
        localStorage.setItem('locationId', res.locationId.toString());


        this.status = 'success';
        this.message = `QR verified: ${res.locationName}`;

        // Redirect after short delay
        this.redirectTimeoutId = setTimeout(() => {
          this.router.navigate(['/attendance']);
        }, 2200);
      },
      error: () => {
        localStorage.removeItem('locationId');
        this.status = 'error';
        this.message = 'QR is invalid or expired';
      }
    });
  }
}
