

import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const google: any;
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { APP_CONFIG } from '../config/app-config';
import { RouterModule, Router } from '@angular/router';
import { AttendanceLog } from '../models/attendance.model';
import { AuditLog } from '../models/audit-log.model';
import { IconComponent } from '../shared/icon.component';

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
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})

export class AdminDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  apiUrl = APP_CONFIG.baseUrl;
  baseScanUrl = location.origin;
  ADMIN_TABS = ADMIN_TABS;

  // Map picker state
  showMapPicker = false;
  locationFetching = false;
  pickerMap: any = null;
  pickerMarker: any = null;
  pickerCircle: any = null;

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

  // Search filters
  watchmenSearch = '';
  attendanceSearch = '';

  qrLoading = false;
  auditLogs: AuditLog[] = [];
  isTab(tab: AdminTab): boolean {
    return this.activeTab === tab;
  }

  shifts: any[] = [];
  selectedAttendance = new Set<string>();
  loading = false;
  requests: AttendanceRequest[] = [];

  get pendingRequestCount(): number {
    return this.requests.filter(r => r.status === 'Pending').length;
  }

  get filteredWatchmen(): any[] {
    if (!this.watchmenSearch.trim()) return this.watchmen;
    const search = this.watchmenSearch.toLowerCase();
    return this.watchmen.filter(w =>
      w.fullName?.toLowerCase().includes(search) ||
      w.username?.toLowerCase().includes(search)
    );
  }

  get filteredAttendance(): AttendanceLog[] {
    if (!this.attendanceSearch.trim()) return this.attendance;
    const search = this.attendanceSearch.toLowerCase();
    return this.attendance.filter(a =>
      a.fullName?.toLowerCase().includes(search)
    );
  }

  constructor(private api: ApiService, private router: Router) { }
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

  ngAfterViewInit(): void {
    // Map picker is initialized when opened
  }

  ngOnDestroy(): void {
    if (this.pickerMap) {
      this.pickerMap = null;
    }
  }

  // =======================
  // LOCATION METHODS
  // =======================

  autoFetchLocation(): void {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    this.locationFetching = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.qr.latitude = parseFloat(position.coords.latitude.toFixed(6));
        this.qr.longitude = parseFloat(position.coords.longitude.toFixed(6));
        this.locationFetching = false;
      },
      (error) => {
        this.locationFetching = false;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Location permission denied. Please allow location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Location information unavailable.');
            break;
          case error.TIMEOUT:
            alert('Location request timed out.');
            break;
          default:
            alert('Failed to get location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  openMapPicker(): void {
    this.showMapPicker = true;
    setTimeout(() => this.initMapPicker(), 100);
  }

  closeMapPicker(): void {
    this.showMapPicker = false;
  }

  initMapPicker(): void {
    const mapEl = document.getElementById('location-picker-map');
    if (!mapEl) return;

    const defaultCenter = { lat: this.qr.latitude || 20.5937, lng: this.qr.longitude || 78.9629 };

    this.pickerMap = new google.maps.Map(mapEl, {
      center: defaultCenter,
      zoom: this.qr.latitude ? 16 : 5,
      mapTypeId: 'roadmap',
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#8b8b8b' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d2d44' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e1a' }] }
      ]
    });

    if (this.qr.latitude && this.qr.longitude) {
      this.placePickerMarker({ lat: this.qr.latitude, lng: this.qr.longitude });
    }

    this.pickerMap.addListener('click', (e: any) => {
      const lat = parseFloat(e.latLng.lat().toFixed(6));
      const lng = parseFloat(e.latLng.lng().toFixed(6));
      this.qr.latitude = lat;
      this.qr.longitude = lng;
      this.placePickerMarker({ lat, lng });
    });
  }

  placePickerMarker(position: { lat: number; lng: number }): void {
    if (this.pickerMarker) {
      this.pickerMarker.setPosition(position);
    } else {
      this.pickerMarker = new google.maps.Marker({
        position,
        map: this.pickerMap,
        draggable: true
      });

      this.pickerMarker.addListener('dragend', () => {
        const pos = this.pickerMarker.getPosition();
        this.qr.latitude = parseFloat(pos.lat().toFixed(6));
        this.qr.longitude = parseFloat(pos.lng().toFixed(6));
        this.updatePickerCircle();
      });
    }

    this.updatePickerCircle();
  }

  updatePickerCircle(): void {
    const radius = this.qr.radius || 50;
    const center = { lat: this.qr.latitude!, lng: this.qr.longitude! };

    if (this.pickerCircle) {
      this.pickerCircle.setCenter(center);
      this.pickerCircle.setRadius(radius);
    } else {
      this.pickerCircle = new google.maps.Circle({
        map: this.pickerMap,
        center,
        radius,
        strokeColor: '#10b981',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: '#10b981',
        fillOpacity: 0.2
      });
    }

    // Fit map bounds to show the full circle
    if (this.pickerCircle && this.pickerMap) {
      this.pickerMap.fitBounds(this.pickerCircle.getBounds());
    }
  }

  onRadiusChange(radius: number): void {
    this.qr.radius = radius;
    if (this.pickerCircle && this.qr.latitude && this.qr.longitude) {
      this.updatePickerCircle();
    }
  }

  confirmMapLocation(): void {
    if (!this.qr.latitude || !this.qr.longitude) {
      alert('Please click on the map to select a location');
      return;
    }
    this.closeMapPicker();
  }

  goToMyLocation(): void {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    this.locationFetching = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));
        this.qr.latitude = lat;
        this.qr.longitude = lng;

        if (this.pickerMap) {
          const pos = { lat, lng };
          this.pickerMap.setCenter(pos);
          this.pickerMap.setZoom(17);
          this.placePickerMarker(pos);
        }

        this.locationFetching = false;
      },
      (error) => {
        this.locationFetching = false;
        alert('Failed to get your location. Please allow location access.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
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
    this.router.navigate(['/login']);
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
