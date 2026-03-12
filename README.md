# QR Watchman Attendance System

A full-stack attendance system for security guards and watchmen. The project uses QR location validation, geofence checks, face capture, shift rules, attendance requests, and admin audit logs.

## Project structure

- [WatchmanAttendance.API](WatchmanAttendance.API) - ASP.NET Core Web API (.NET 8)
- [WatchmanAttendance.UI](WatchmanAttendance.UI) - Angular frontend

## Main features

### Admin features
- Admin login
- Create and manage watchman accounts
- Create QR locations with map selection or auto-detected location
- Configure radius-based geofence validation
- View attendance records
- Bulk or single attendance deletion
- Review and approve/reject attendance requests
- Assign and manage shifts
- View audit logs

### Watchman features
- Watchman login
- Scan QR and validate location before attendance flow
- Mark attendance with face capture and GPS location
- View attendance dashboard
- Submit attendance correction requests
- Track request status

## Tech stack

### Backend
- .NET 8
- ASP.NET Core Web API
- Dapper
- SQL Server
- JWT authentication

### Frontend
- Angular 17
- TypeScript
- Tailwind CSS
- Google Maps JavaScript API

## How the system works

1. Admin creates watchman accounts.
2. Admin creates one or more QR locations.
3. Watchman opens the QR link.
4. QR is validated by the API.
5. Watchman logs in if needed.
6. Watchman captures attendance with face photo and current GPS position.
7. API validates the location against the QR location radius.
8. Admin monitors attendance, requests, and audit records.

## Prerequisites

Install these before running the project:

- .NET 8 SDK
- Node.js 18 or later
- npm
- SQL Server or SQL Server Express
- Optional: Azure account for deployment
- Optional: Cloudflare account for Pages or Workers

## Local development setup

## 1. Clone the repository

- `git clone <your-repository-url>`
- `cd QR-Watchman-Attendance-System`

## 2. Configure the backend

Open [WatchmanAttendance.API/appsettings.json](WatchmanAttendance.API/appsettings.json) and update:

- `ConnectionStrings:Default`
- `Jwt:Key`
- `Jwt:Issuer`
- `Jwt:Audience`
- `Frontend:BaseUrl`

Example values already exist in the file for local development.

Current important values:
- Local API base URL: `http://localhost:5036`
- Local frontend URL: `http://localhost:4200`

## 3. Run the backend API

From [WatchmanAttendance.API](WatchmanAttendance.API):

- `dotnet restore`
- `dotnet build`
- `dotnet run`

If you want a specific profile, use the launch profile defined in [WatchmanAttendance.API/Properties/launchSettings.json](WatchmanAttendance.API/Properties/launchSettings.json).

## 4. Configure the frontend API URL

Open [WatchmanAttendance.UI/src/app/config/app-config.ts](WatchmanAttendance.UI/src/app/config/app-config.ts).

For local development it should point to:
- `apiUrl: 'http://localhost:5036/api'`
- `baseUrl: 'http://localhost:5036'`

## 5. Run the frontend

From [WatchmanAttendance.UI](WatchmanAttendance.UI):

- `npm install`
- `npm start`

Or:
- `npx ng serve`

The app should open at:
- `http://localhost:4200`

## Important local notes

### CORS
CORS is configured in [WatchmanAttendance.API/Program.cs](WatchmanAttendance.API/Program.cs). If you change the frontend domain or port, update the allowed origins.

### HTTPS
In this project, local frontend-to-backend communication has been configured to use HTTP on port `5036` to avoid local certificate issues.

### Google Maps
If you use the map picker, make sure the Google Maps script key in [WatchmanAttendance.UI/src/index.html](WatchmanAttendance.UI/src/index.html) is valid.

## Build commands

### Backend
From [WatchmanAttendance.API](WatchmanAttendance.API):
- `dotnet build`

### Frontend
From [WatchmanAttendance.UI](WatchmanAttendance.UI):
- `npm run build`

Angular production output is generated in:
- [WatchmanAttendance.UI/dist/watchman-attendance-ui](WatchmanAttendance.UI/dist/watchman-attendance-ui)

## Deployment overview

Recommended production setup:

- Frontend: Cloudflare Pages or Azure Static Web Apps
- Backend API: Azure App Service
- Database: Azure SQL Database or a reachable SQL Server instance
- Optional edge proxy: Cloudflare Worker

## Deploy backend to Azure App Service

This is the simplest production option for the .NET API.

## Azure resources to create

Create these resources in Azure:

- App Service Plan
- Web App for the API
- Azure SQL Database or SQL Server
- Optional: Application Insights

## Backend deployment steps

### 1. Publish the API
From [WatchmanAttendance.API](WatchmanAttendance.API):

- `dotnet publish -c Release -o ./publish`

### 2. Create the Azure Web App
Use Azure Portal or Azure CLI.

Suggested runtime:
- .NET 8
- Windows or Linux App Service

### 3. Configure App Service settings
In the Azure Web App configuration, add settings for:

- `ConnectionStrings__Default`
- `Jwt__Key`
- `Jwt__Issuer`
- `Jwt__Audience`
- `Frontend__BaseUrl`

Use environment variables in Azure instead of storing production secrets in source control.

### 4. Configure CORS in the API
Update [WatchmanAttendance.API/Program.cs](WatchmanAttendance.API/Program.cs) so `WithOrigins(...)` includes your production frontend domain, for example:

- `https://your-frontend.pages.dev`
- `https://attendance.yourdomain.com`

### 5. Deploy published files
Deploy the `publish` folder to Azure App Service using:

- Visual Studio publish
- Zip deploy
- GitHub Actions
- Azure CLI

## Example production backend settings

Typical values:

- API URL: `https://your-api.azurewebsites.net`
- Swagger URL: `https://your-api.azurewebsites.net/swagger`

## Deploy frontend to Cloudflare Pages

Cloudflare Pages is a good option for the Angular UI because it serves static files globally.

## Frontend build configuration

Before building for production, update [WatchmanAttendance.UI/src/app/config/app-config.ts](WatchmanAttendance.UI/src/app/config/app-config.ts):

- `apiUrl` should point to your deployed API, for example `https://your-api.azurewebsites.net/api`
- `baseUrl` should point to your deployed API root, for example `https://your-api.azurewebsites.net`

Then build the app:

- `npm install`
- `npm run build`

## Cloudflare Pages settings

When creating the Pages project, use:

- Framework preset: Angular or None
- Build command: `npm run build`
- Build output directory: `dist/watchman-attendance-ui/browser`

If that folder does not exist in your build output, use the generated folder shown after the Angular build completes.

## Cloudflare Pages routing

Because Angular is a single-page application, add a fallback for client-side routes.

Recommended approach:
- Configure Pages to serve `index.html` for unknown routes
- Or add `_redirects` support if you choose that approach in your deployment pipeline

This prevents direct links such as `/login`, `/scan/:token`, or `/watchman/dashboard` from returning 404.

## Use Cloudflare Worker with this project

Cloudflare Workers cannot run this ASP.NET Core API directly as-is.

Practical use of Workers for this project:
- reverse proxy requests to the Azure API
- add a custom API domain like `api.yourdomain.com`
- handle edge headers or basic request rewriting

So the practical architecture is:

- Angular UI on Cloudflare Pages
- .NET API on Azure App Service
- optional Cloudflare Worker in front of the Azure API

## Example Worker use case

You can point:
- `https://app.yourdomain.com` -> Cloudflare Pages
- `https://api.yourdomain.com` -> Cloudflare Worker -> Azure App Service API

Then set frontend config to:
- `apiUrl: 'https://api.yourdomain.com/api'`
- `baseUrl: 'https://api.yourdomain.com'`

## Deploy frontend to Azure instead

If you prefer Azure only, you can also deploy the Angular app to:

- Azure Static Web Apps
- Azure App Service as static files

In that case:
- frontend stays on Azure
- backend stays on Azure App Service
- database stays on Azure SQL

## Production checklist

Before going live, make sure you:

- change the JWT secret
- store all secrets in Azure configuration or secret storage
- update CORS allowed origins
- update [WatchmanAttendance.UI/src/app/config/app-config.ts](WatchmanAttendance.UI/src/app/config/app-config.ts) to production URLs
- verify Google Maps API key restrictions
- verify SQL connectivity from Azure
- test QR scan flow on a real mobile device
- test camera permission and GPS permission on HTTPS
- make sure uploads are stored in a persistent location if needed

## Common issues

### QR opens but asks for login
Expected behavior if the watchman is not signed in. After login, the app should continue to attendance.

### Camera or GPS does not work in production
Camera and geolocation usually require HTTPS in browsers, especially on mobile. Make sure both frontend and backend are deployed over HTTPS.

### Angular route 404 on refresh
Configure SPA fallback on Cloudflare Pages or Azure Static Web Apps.

### API blocked by CORS
Add your deployed frontend domain to `WithOrigins(...)` in [WatchmanAttendance.API/Program.cs](WatchmanAttendance.API/Program.cs).

### Cloudflare Worker cannot host .NET API directly
Correct. Use Worker as a proxy layer, not as the runtime for this ASP.NET Core app.

## Suggested production architecture

### Option 1: Recommended
- Angular UI -> Cloudflare Pages
- API -> Azure App Service
- Database -> Azure SQL
- Optional edge proxy -> Cloudflare Worker

### Option 2: Azure only
- Angular UI -> Azure Static Web Apps
- API -> Azure App Service
- Database -> Azure SQL

## Useful files

- [README.md](README.md)
- [WatchmanAttendance.API/Program.cs](WatchmanAttendance.API/Program.cs)
- [WatchmanAttendance.API/appsettings.json](WatchmanAttendance.API/appsettings.json)
- [WatchmanAttendance.UI/src/app/config/app-config.ts](WatchmanAttendance.UI/src/app/config/app-config.ts)
- [WatchmanAttendance.UI/angular.json](WatchmanAttendance.UI/angular.json)