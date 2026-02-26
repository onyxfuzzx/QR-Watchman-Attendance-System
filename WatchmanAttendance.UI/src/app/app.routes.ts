import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { ScanComponent } from './watchman/scan.component';
import { AttendanceComponent } from './watchman/attendance.component';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { WatchmanDashboardComponent } from './watchman/watchman-dashboard.component';
import { authGuard } from './services/auth.guard';
import { roleGuard } from './services/role.guard';

export const routes: Routes = [

  // ================= PUBLIC =================
  {
    path: 'login',
    component: LoginComponent
  },

  // QR scan must be public
  {
    path: 'scan/:token',
    component: ScanComponent
  },

  // ================= ADMIN =================
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    //canActivate: [authGuard, roleGuard],
    //data: { role: 'Admin' }
  },

  // ================= WATCHMAN =================
  {
    path: 'watchman/dashboard',
    component: WatchmanDashboardComponent,
    //canActivate: [authGuard, roleGuard],
    //data: { role: 'Watchman' }
  },

  {
    path: 'attendance',
    component: AttendanceComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Watchman' }
  },

  // ================= MAP =================
  {
    path: 'map',
    loadComponent: () =>
      import('./maps/radius-map/radius-map.component')
        .then(m => m.RadiusMapComponent)
  },

  // ================= DEFAULT =================
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];



//import { Routes } from '@angular/router';
//import { AdminLoginComponent } from './auth/admin-login.component';
//import { WatchmanLoginComponent } from './auth/watchman-login.component';
//import { ScanComponent } from './watchman/scan.component';
//import { AttendanceComponent } from './watchman/attendance.component';
//import { AdminDashboardComponent } from './admin/admin-dashboard.component';
//import { WatchmanDashboardComponent } from './watchman/watchman-dashboard.component';
//import { authGuard } from './services/auth.guard';
//import { roleGuard } from './services/role.guard';
//import { LoginComponent } from './auth/login.component';

//export const routes: Routes = [

//  // ================= PUBLIC =================
//  { path: 'admin/login', component: AdminLoginComponent },
//  { path: 'watchman/login', component: WatchmanLoginComponent },

//  // 🔓 QR SCAN MUST BE PUBLIC
//  {
//    path: 'scan/:token',
//    component: ScanComponent
//  },


//  { path: 'login', component: LoginComponent },
//  { path: 'admin/dashboard', component: AdminDashboardComponent },
//  { path: 'watchman/dashboard', component: WatchmanDashboardComponent },
//  { path: '**', redirectTo: 'login' },


//  // ================= ADMIN =================
//  {
//    path: 'admin/dashboard',
//    component: AdminDashboardComponent,
//    canActivate: [authGuard, roleGuard],
//    data: { role: 'Admin' }
//  },

//  // ================= WATCHMAN =================
//  {
//    path: 'attendance',
//    component: AttendanceComponent,
//    canActivate: [authGuard, roleGuard],
//    data: { role: 'Watchman' }
//  },

//  {
//    path: 'watchman/dashboard',
//    component: WatchmanDashboardComponent,
//    canActivate: [authGuard, roleGuard],
//    data: { role: 'Watchman' }
//  }
//,

//  // ================= MAP =================
//  {
//    path: 'map',
//    loadComponent: () =>
//      import('./maps/radius-map/radius-map.component')
//        .then(m => m.RadiusMapComponent)
//  },

//  // ================= DEFAULT =================
//  { path: '', redirectTo: 'watchman/login', pathMatch: 'full' }
//];
