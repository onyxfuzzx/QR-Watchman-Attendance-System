# Watchman Attendance System

A full-stack attendance tracking platform for security guards (watchmen) with QR-based location validation, geofence verification, shift management, and admin auditing.

## Live Demo

- **Demo URL:** https://guard.abacusx.com

## Project Structure

- `WatchmanAttendance.API/` – ASP.NET Core Web API (.NET 8)
- `WatchmanAttendance.UI/` – Angular frontend

## Core Features

### Authentication & Roles
- Admin login
- Watchman login
- JWT-based authorization
- Role-based access control

### Attendance
- Mark attendance with location-aware validation
- QR code validation before attendance mark
- Attendance history for watchmen
- Admin attendance listing and deletion (single/bulk)

### Attendance Requests
- Watchmen can submit attendance change requests (e.g., late arrival, half day)
- Admin can approve or reject requests
- Request status tracking

### QR & Geofence
- Admin creates QR locations
- QR token validation endpoint
- Radius-based location checks
- Enable/disable QR locations

### Shift Management
- Assign shifts to watchmen
- Configure grace minutes and half-day thresholds
- Shift list and retrieval for admin views

### Admin Tools
- Watchman creation and status management (enable/disable)
- Attendance dashboard and records
- QR location management
- Audit logs for admin actions

## Backend Overview (`WatchmanAttendance.API`)

### Tech Stack
- .NET 8
- ASP.NET Core Web API
- Repository pattern for data access
- JWT authentication

### Main Layers
- `Controllers/` – API endpoints for auth, attendance, QR, admin, shifts, files
- `Repositories/` – data access abstractions and SQL operations
- `Services/` – JWT, DB connection factory, timezone and geo helpers
- `DTOs/` – request/response transfer models
- `Models/` – domain entities

### API Areas
- `AuthController` – admin/watchman authentication
- `AttendanceController` – attendance mark and history
- `AttendanceRequestController` / `AdminAttendanceRequestController` – request workflow
- `QrController` / `QrValidationController` – QR generation and validation
- `AdminController`, `AdminShiftController` – administration and shifts
- `FilesController` – file upload/serving behavior for attendance media

## Frontend Overview (`WatchmanAttendance.UI`)

### Tech Stack
- Angular
- TypeScript
- Tailwind CSS

### Main Modules
- Admin dashboard (watchmen, attendance, requests, shifts, audit, QR)
- Watchman workflows (login, mark attendance, request corrections)
- Shared API service for backend communication
- Token-based session handling in auth service

## Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm
- SQL Server instance

### 1) Backend Setup
1. Go to `WatchmanAttendance.API`.
2. Configure `appsettings.json`:
   - `ConnectionStrings:Default`
   - `Jwt:Key`
3. Run the API:
   - `dotnet restore`
   - `dotnet run`

### 2) Frontend Setup
1. Go to `WatchmanAttendance.UI`.
2. Install dependencies:
   - `npm install`
3. Run Angular app:
   - `npm start`

## Configuration Notes

- Sensitive values were removed from tracked config for safe GitHub publishing.
- Keep production secrets in secure stores (environment variables, secret manager, or CI/CD secrets).

## Typical User Flow

1. Admin creates watchman accounts and QR locations.
2. Watchman scans/uses QR process and marks attendance with location proof.
3. If needed, watchman submits attendance correction request.
4. Admin reviews requests and approves/rejects.
5. Admin monitors audit logs and attendance records.

## Deployment Notes

- Frontend can be hosted as static build output.
- Backend can run on IIS, Azure App Service, or Linux host with reverse proxy.
- Ensure CORS and frontend base URL are configured correctly.


