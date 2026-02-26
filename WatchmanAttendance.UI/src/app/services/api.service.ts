import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { APP_CONFIG } from '../config/app-config';
import { AttendanceLog } from '../models/attendance.model';
import {AuditLog } from '../models/audit-log.model'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = APP_CONFIG.apiUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  private authHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      })
    };
  }

  // ================= AUTH =================
  adminLogin(data: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  watchmanLogin(data: any) {
    return this.http.post(`${this.baseUrl}/auth/watchman/login`, data);
  }

  // ================= QR =================
  validateQr(token: string) {
    return this.http.post(
      `${this.baseUrl}/qr/validate`,
      { qrToken: token }
    );
  }

  createQrLocation(data: any) {
    return this.http.post(
      `${this.baseUrl}/qr/create`,
      data,
      this.authHeaders()
    );
  }

  getQrLocations() {
    return this.http.get(
      `${this.baseUrl}/qr/list`,
      this.authHeaders()
    );
  }

  disableQr(id: string) {
    return this.http.post(
      `${this.baseUrl}/qr/disable/${id}`,
      {},
      this.authHeaders()
    );
  }

  // ================= WATCHMEN (FIXED) =================
  getWatchmen() {
    return this.http.get<any[]>(
      `${this.baseUrl}/admin/watchmen`,
      this.authHeaders()   // ✅ FIX
    );
  }

  disableWatchman(id: string) {
    return this.http.post(
      `${this.baseUrl}/admin/watchman/disable/${id}`,
      {},
      this.authHeaders()   // ✅ FIX
    );
  }

  enableWatchman(id: string) {
    return this.http.post(
      `${this.baseUrl}/admin/watchman/enable/${id}`,
      {},
      this.authHeaders()   // ✅ FIX
    );
  }

  getWatchmanDashboard() {
    return this.http.get<any>(
      `${this.baseUrl}/watchman/dashboard`,
      this.authHeaders()
    );
  }

  createWatchman(data: any) {
    return this.http.post(
      `${this.baseUrl}/admin/watchman`,
      data,
      this.authHeaders()
    );
  }

  // ================= ATTENDANCE =================
  markAttendance(formData: FormData) {
    return this.http.post(
      `${this.baseUrl}/attendance/mark`,
      formData,
      this.authHeaders()
    );
  }

  getAttendance() {
    return this.http.get<AttendanceLog[]>(
      `${this.baseUrl}/admin/attendance`,
      this.authHeaders()
    );
  }

  deleteAttendance(id: string) {
    return this.http.delete(
      `${this.baseUrl}/admin/attendance/${id}`,
      this.authHeaders()
    );
  }

  bulkDelete(ids: string[]) {
    return this.http.post(
      `${this.baseUrl}/admin/attendance/bulk-delete`,
      ids,
      this.authHeaders()
    );
  }
  getAuditLogs() {
    return this.http.get<AuditLog[]>(
      `${this.baseUrl}/admin/audit`,
      this.authHeaders()
    );
  }
  getMyAttendanceHistory() {
    return this.http.get<any[]>(
      `${this.baseUrl}/attendance/history`,
      this.authHeaders()
    );
  }
  createAttendanceRequest(data: any) {
    return this.http.post(
      `${this.baseUrl}/attendance/request`,
      data,
      this.authHeaders()
    );
  }

  getMyAttendanceRequests() {
    return this.http.get<any[]>(
      `${this.baseUrl}/attendance/request`,
      this.authHeaders()
    );
  }
  getAttendanceRequests() {
    return this.http.get<any[]>(
      `${this.baseUrl}/admin/attendance-request`,
      this.authHeaders()
    );
  }

  approveAttendanceRequest(id: string) {
    return this.http.post(
      `${this.baseUrl}/admin/attendance-request/${id}/approve`,
      {},
      this.authHeaders()
    );
  }

  rejectAttendanceRequest(id: string) {
    return this.http.post(
      `${this.baseUrl}/admin/attendance-request/${id}/reject`,
      {},
      this.authHeaders()
    );
  }
  getDashboardChart() {
    return this.http.get<any>(
      `${this.baseUrl}/watchman/dashboard/chart`,
      this.authHeaders()
    );
  }
  assignShift(data: any) {
    return this.http.post(
      `${this.baseUrl}/admin/shift/assign`,
      data,
      this.authHeaders()
    );
  }

  login(data: any) {
    return this.http.post(
      `${this.baseUrl}/auth/login`,
      data
    );
  }


  getShifts() {
    return this.http.get<any[]>(
      `${this.baseUrl}/admin/shift`,
      this.authHeaders()
    );
  }


}
