  

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { APP_CONFIG } from '../config/app-config';
import { RouterModule } from '@angular/router';
import { AttendanceLog } from '../models/attendance.model';
import { AuditLog } from '../models/audit-log.model';
import qrcode from 'qrcode';

interface AttendanceRequest {
  id: string;
  watchmanId: string;
  attendanceDate: string;
  type: 'LateArrival' | 'HalfDay';
  reason: string;
  expectedTime?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export const ADMIN_TABS = {
  watchmen: 'watchmen',
  attendance: 'attendance',
  qr: 'qr',
  audit: 'audit',
  requests: 'requests',
  shifts: 'shifts'
} as const;

type AdminTab = typeof ADMIN_TABS[keyof typeof ADMIN_TABS];

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})

export class AdminDashboardComponent implements OnInit {

  apiUrl = APP_CONFIG.baseUrl;
  baseScanUrl = location.origin;
  ADMIN_TABS = ADMIN_TABS;

  // Create watchman
  wm = {
    fullName: '',
    username: '',
    password: ''
  };

  // Create QR
  qr = {
    locationName: '',
    latitude: null as number | null,
    longitude: null as number | null,
    radius: null as number | null
  };

  activeTab: AdminTab = 'watchmen';
  showQrFor: string | null = null;
  qrImageMap: { [key: string]: string } = {};
  qrResult: any = null;
  qrLocations: any[] = [];
  attendance: AttendanceLog[] = [];
  watchmen: any[] = [];
  qrLoading = false;
  auditLogs: AuditLog[] = [];
  isTab(tab: AdminTab): boolean {
    return this.activeTab === tab;
  }

  shifts: any[] = [];
  selectedAttendance = new Set<string>();
  loading = false;
  requests: AttendanceRequest[] = [];
  constructor(private api: ApiService) { }
  shiftForm = {
    watchmanId: '',
    entryTime: '',
    exitTime: '',
    graceMinutes: 5,
    halfDayAfterMinutes: 120
  };
  ngOnInit(): void {
    this.loadAttendance();
    this.loadQrLocations();
    this.loadWatchmen();
    this.loadRequests();
  }

  // =======================
  // LOAD DATA
  // =======================

  loadAudit() {
    this.api.getAuditLogs().subscribe((res: any[]) => {
      console.log('RAW AUDIT:', res);

      this.auditLogs = res.map(l => ({
        id: l.id ?? l.Id,
        recordId: l.recordId ?? l.RecordId,
        adminName: l.adminName ?? l.AdminName,
        action: l.action ?? l.Action,
        tableName: l.tableName ?? l.TableName,
        performedAt: l.performedAt ?? l.PerformedAt,
        createdAt: l.createdAt ?? l.CreatedAt
      }));


      console.log('MAPPED AUDIT:', this.auditLogs);
    });
  }

  loadAttendance() {
    this.api.getAttendance().subscribe((res: any[]) => {
      console.log('RAW ATTENDANCE:', res);

      this.attendance = res.map(a => ({
        id: a.id ?? a.Id,
        fullName: a.fullName ?? a.FullName,
        latitude: a.latitude ?? a.Latitude,
        longitude: a.longitude ?? a.Longitude,
        createdAt: a.createdAt ?? a.CreatedAt,
        photoPath: a.photoPath ?? a.PhotoPath
      }));

      console.log('MAPPED ATTENDANCE:', this.attendance);
    });
  }

  loadRequests() {
    this.loading = true;
    this.api.getAttendanceRequests().subscribe(res => {
      this.requests = res;
      this.loading = false;
    });
  }

  approve(id: string) {
    if (!confirm('Approve this request?')) return;

    this.api.approveAttendanceRequest(id).subscribe({
      next: () => {
        this.loadRequests();
        this.loadAudit();
      },
      error: err => console.error(err)
    });
  }

  reject(id: string) {
    if (!confirm('Reject this request?')) return;

    this.api.rejectAttendanceRequest(id).subscribe(() => {
      this.loadRequests();
    });
  }
  loadQrLocations() {
    this.api.getQrLocations().subscribe(res => {
      this.qrLocations = res as any[];
    });
  }

  // =======================
  // ACTIONS
  // =======================

  logout() {
    localStorage.clear();
    location.href = '/admin/login';
  }

  setTab(tab: AdminTab) {
    this.activeTab = tab;

    if (tab === ADMIN_TABS.audit) {
      this.loadAudit();
    }
    if (tab === ADMIN_TABS.shifts) {
      this.loadShifts();
    }
    if (tab === ADMIN_TABS.requests) {
      this.loadRequests();
    }
    if (tab === ADMIN_TABS.qr) {
      this.loadQrLocations();
    }
    if (tab === ADMIN_TABS.watchmen) {
      this.loadWatchmen();
    }
    if (tab === ADMIN_TABS.attendance) {
      this.loadAttendance();
    }
  }




  createWatchman() {
    this.api.createWatchman(this.wm).subscribe(() => {
      alert('Watchman created');
      this.loadWatchmen();
      this.wm = { fullName: '', username: '', password: '' };
    });
  }

  createQr() {
    if (
      !this.qr.locationName ||
      this.qr.latitude == null ||
      this.qr.longitude == null ||
      this.qr.radius == null ||
      this.qr.radius <= 0
    ) {
      alert('Invalid QR data');
      return;
    }


    const payload = {
      locationName: this.qr.locationName,
      latitude: this.qr.latitude,
      longitude: this.qr.longitude,
      radius: this.qr.radius
    };

    this.api.createQrLocation(payload).subscribe(res => {
      this.qrResult = res;
      alert('QR created');
      this.loadQrLocations();
    });
  
  }


  loadShifts() {
    this.api.getShifts().subscribe(res => {
      this.shifts = res;
    });
  }

  assignShift() {
    this.api.assignShift(this.shiftForm).subscribe(() => {
      alert('Shift assigned');
      this.loadShifts();
    });
  }

  disableQr(id: string) {
    this.api.disableQr(id).subscribe(() => {
      alert('QR disabled');
      this.loadQrLocations();
    });
  }

  loadWatchmen() {
    this.api.getWatchmen().subscribe(res => {
      this.watchmen = res;
    });
  }

  disableWatchman(id: string) {
    this.api.disableWatchman(id).subscribe(() => {
      alert('Watchman disabled');
      this.loadWatchmen();
    });
  }

  enableWatchman(id: string) {
    this.api.enableWatchman(id).subscribe(() => {
      alert('Watchman enabled');
      this.loadWatchmen();
    });
  }




  // SINGLE DELETE
deleteAttendance(id: string) {
  if (!confirm('Delete this attendance record?')) return;

  this.api.deleteAttendance(id).subscribe(() => {
    this.attendance = this.attendance.filter(a => a.id !== id);
  });
}

// CHECKBOX TOGGLE
toggleSelect(id: string) {
  this.selectedAttendance.has(id)
    ? this.selectedAttendance.delete(id)
    : this.selectedAttendance.add(id);
}

// BULK DELETE
bulkDelete() {
  if (this.selectedAttendance.size === 0) return;
  if (!confirm(`Delete ${this.selectedAttendance.size} records?`)) return;

  const ids = Array.from(this.selectedAttendance);

  this.api.bulkDelete(ids).subscribe(() => {
    this.attendance = this.attendance.filter(a => !this.selectedAttendance.has(a.id));
    this.selectedAttendance.clear();
  });
}











  



  async toggleQr(q: any) {
    if (this.showQrFor === q.id) {
      this.showQrFor = null;
      return;
    }

    this.showQrFor = q.id;

    if (!this.qrImageMap[q.id]) {
      const url = `${this.baseScanUrl}/scan/${q.qrToken}`;
      const QRCode = (await import('qrcode')).default;
      this.qrImageMap[q.id] = await QRCode.toDataURL(url);
    }
  }


}
