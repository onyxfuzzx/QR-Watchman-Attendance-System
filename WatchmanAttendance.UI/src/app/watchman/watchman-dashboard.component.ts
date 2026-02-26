import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'

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

@Component({
  standalone: true,
  selector: 'app-watchman-dashboard',
  templateUrl: './watchman-dashboard.component.html',
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['./watchman-dashboard.component.css']
})
export class WatchmanDashboardComponent implements OnInit {
  activeTab: 'overview' | 'requests' = 'overview';
  watchmanName = '';
  loading = false;
 
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
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;

    this.api.getWatchmanDashboard().subscribe({
      next: (res: DashboardResponse) => {
        this.watchmanName = res.watchmanName;
        this.summary = res.summary;
        this.attendance = res.attendance;
        this.recentActivity = res.recentActivity;
        this.loading = false;
      },
      error: () => {
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
    location.href = '/watchman/login';
  }
}
