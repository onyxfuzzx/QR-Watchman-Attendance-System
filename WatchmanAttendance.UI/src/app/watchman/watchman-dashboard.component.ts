import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../shared/icon.component';

interface AttendanceItem {
  date: string;
  punchTime: string;
  status: 'Present' | 'Late' | 'HalfDay';
  locationVerified: boolean;
}
interface AttendanceRequest {
  attendanceDate: string;
  reason: string;
  type: string;
  status: string;
  createdAt: string;
}
interface RecentActivityItem {
  time: string;
}

interface DashboardResponse {
  watchmanName: string;
  summary: {
    month: string;
    presentDays: number;
    percentage: number;
    lastPunch: string | null;
  };
  attendance: AttendanceItem[];
  recentActivity: RecentActivityItem[];
}

type DashboardApiResponse = Partial<DashboardResponse> & {
  WatchmanName?: string;
  Summary?: {
    Month?: string;
    PresentDays?: number;
    Percentage?: number;
    LastPunch?: string | null;
  };
  Attendance?: Array<{
    Date?: string;
    PunchTime?: string;
    Status?: 'Present' | 'Late' | 'HalfDay';
    LocationVerified?: boolean;
  }>;
  RecentActivity?: Array<{
    Time?: string;
  }>;
};

type RawAttendanceItem = Partial<AttendanceItem> & {
  Date?: string;
  PunchTime?: string;
  Status?: 'Present' | 'Late' | 'HalfDay';
  LocationVerified?: boolean;
};

type RawRecentActivityItem = Partial<RecentActivityItem> & {
  Time?: string;
};

type RawDashboardSummary = Partial<DashboardResponse['summary']> & {
  Month?: string;
  PresentDays?: number;
  Percentage?: number;
  LastPunch?: string | null;
};

@Component({
  standalone: true,
  selector: 'app-watchman-dashboard',
  templateUrl: './watchman-dashboard.component.html',
  imports: [CommonModule, RouterModule, FormsModule, IconComponent],
  styleUrls: ['./watchman-dashboard.component.css']
})
export class WatchmanDashboardComponent implements OnInit {
  activeTab: 'overview' | 'requests' = 'overview';
  watchmanName = '';
  loading = false;
  error = '';

  loadingRequests = false;
  summary = {
    month: '',
    presentDays: 0,
    percentage: 0,
    lastPunch: null as string | null
  };
  selectedAttendance: AttendanceItem | null = null;
  requestReason = '';
  expectedTime = '';


  attendance: AttendanceItem[] = [];
  recentActivity: RecentActivityItem[] = [];
  requests: AttendanceRequest[] = [];
  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = '';

    this.api.getWatchmanDashboard().subscribe({
      next: (res: DashboardApiResponse) => {
        const dashboard = this.normalizeDashboardResponse(res);

        this.watchmanName = dashboard.watchmanName;
        this.summary = dashboard.summary;
        this.attendance = dashboard.attendance;
        this.recentActivity = dashboard.recentActivity;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load dashboard right now.';
        this.loading = false;
      }
    });
  }
  loadRequests() {
    this.loadingRequests = true;
    this.api.getMyAttendanceRequests().subscribe(res => {
      this.requests = res;
      this.loadingRequests = false;
    });
  }

  startRequest(attendance: AttendanceItem): void {
    if (attendance.status === 'Present') return;

    this.selectedAttendance = attendance;
    this.requestReason = '';
    this.activeTab = 'requests';
  }

  openLateRequest() {
    const reason = prompt('Reason for late arrival');
    if (!reason) return;

    const expectedTime = prompt('Expected arrival time (HH:mm)');
    if (!expectedTime) return;

    this.api.createAttendanceRequest({
      attendanceDate: new Date().toISOString(),
      type: 'LateArrival',
      reason,
      expectedTime
    }).subscribe(() => {
      alert('Late arrival request submitted');
    });
  }

  switchTab(tab: 'overview' | 'requests') {
    this.activeTab = tab;

    if (tab === 'requests' && this.requests.length === 0) {
      this.loadRequests();
    }
  }

  submitRequest(): void {
    if (!this.selectedAttendance || !this.requestReason.trim()) return;

    this.api.createAttendanceRequest({
      attendanceDate: this.selectedAttendance.date,
      type: this.selectedAttendance.status,
      reason: this.requestReason
    }).subscribe(() => {
      alert('Request submitted');

      this.requestReason = '';
      this.selectedAttendance = null;

      this.loadRequests();
    });
  }


  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  private normalizeDashboardResponse(res: DashboardApiResponse): DashboardResponse {
    const summary = (res.summary ?? res.Summary ?? {}) as RawDashboardSummary;
    const attendance = (res.attendance ?? res.Attendance ?? []) as RawAttendanceItem[];
    const recentActivity = (res.recentActivity ?? res.RecentActivity ?? []) as RawRecentActivityItem[];

    return {
      watchmanName: res.watchmanName ?? res.WatchmanName ?? 'Watchman',
      summary: {
        month: summary.month ?? summary.Month ?? '',
        presentDays: summary.presentDays ?? summary.PresentDays ?? 0,
        percentage: summary.percentage ?? summary.Percentage ?? 0,
        lastPunch: summary.lastPunch ?? summary.LastPunch ?? null
      },
      attendance: attendance.map(item => ({
        date: item.date ?? item.Date ?? '',
        punchTime: item.punchTime ?? item.PunchTime ?? '',
        status: item.status ?? item.Status ?? 'Present',
        locationVerified: item.locationVerified ?? item.LocationVerified ?? false
      })),
      recentActivity: recentActivity.map(item => ({
        time: item.time ?? item.Time ?? ''
      }))
    };
  }
}
