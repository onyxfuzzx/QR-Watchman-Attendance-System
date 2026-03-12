
-- Created by GitHub Copilot in SSMS - review carefully before executing
-- Complete database creation script for WatchmanAttendance with all tables and data

-- ==============================================
-- STEP 1: CREATE DATABASE
-- ==============================================
CREATE DATABASE [WatchmanAttendance]
GO

USE [WatchmanAttendance];
GO

-- ==============================================
-- STEP 2: CREATE TABLES
-- ==============================================

-- Table: Admins
CREATE TABLE [dbo].[Admins](
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [Username] NVARCHAR(100) NULL,
    [PasswordHash] NVARCHAR(255) NULL,
    CONSTRAINT [PK__Admins__3214EC075741B288] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

CREATE UNIQUE NONCLUSTERED INDEX [UQ__Admins__536C85E46A3DE04A] 
ON [dbo].[Admins]([Username] ASC) WHERE [Username] IS NOT NULL;
GO

-- Table: AdminAuditLogs
CREATE TABLE [dbo].[AdminAuditLogs](
    [Id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [DF_AdminAuditLogs_Id] DEFAULT (NEWID()),
    [AdminId] UNIQUEIDENTIFIER NOT NULL,
    [AdminName] NVARCHAR(200) NOT NULL,
    [Action] NVARCHAR(200) NOT NULL,
    [TableName] NVARCHAR(200) NULL,
    [RecordId] UNIQUEIDENTIFIER NULL,
    [Description] NVARCHAR(MAX) NULL,
    [CreatedAt] DATETIME2(7) NOT NULL CONSTRAINT [DF_AdminAuditLogs_CreatedAt] DEFAULT (GETDATE()),
    [PerformedAt] VARCHAR(99) NULL,
    CONSTRAINT [PK__AdminAud__3214EC07E8F425CF] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- Table: AuditLogs
CREATE TABLE [dbo].[AuditLogs](
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [Action] NVARCHAR(200) NULL,
    [Entity] NVARCHAR(100) NULL,
    [EntityId] UNIQUEIDENTIFIER NULL,
    [PerformedBy] UNIQUEIDENTIFIER NULL,
    [PerformedAt] DATETIME NULL CONSTRAINT [DF_AuditLogs_PerformedAt] DEFAULT (GETDATE()),
    [TableName] NVARCHAR(200) NOT NULL,
    [RecordId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [PK__AuditLog__3214EC074F41800F] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- Table: QrLocations
CREATE TABLE [dbo].[QrLocations](
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [LocationName] NVARCHAR(200) NOT NULL,
    [Latitude] DECIMAL(9, 6) NOT NULL,
    [Longitude] DECIMAL(9, 6) NOT NULL,
    [QrToken] NVARCHAR(200) NOT NULL,
    [IsActive] BIT NULL CONSTRAINT [DF_QrLocations_IsActive] DEFAULT ((1)),
    [CreatedAt] DATETIME2(7) NULL CONSTRAINT [DF_QrLocations_CreatedAt] DEFAULT (GETDATE()),
    [AllowedRadiusMeters] INT NOT NULL CONSTRAINT [DF_QrLocations_AllowedRadiusMeters] DEFAULT ((100)),
    CONSTRAINT [PK__QrLocati__3214EC0724FB6C35] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

CREATE UNIQUE NONCLUSTERED INDEX [UQ__QrLocati__517D24C5FAFA51B1] 
ON [dbo].[QrLocations]([QrToken] ASC);
GO

-- Table: Watchmen
CREATE TABLE [dbo].[Watchmen](
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [FullName] NVARCHAR(200) NULL,
    [Username] NVARCHAR(100) NULL,
    [PasswordHash] NVARCHAR(255) NULL,
    [IsActive] BIT NULL,
    [ShiftId] UNIQUEIDENTIFIER NULL,
    CONSTRAINT [PK__Watchmen__3214EC07A48DFEA4] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

CREATE UNIQUE NONCLUSTERED INDEX [UQ__Watchmen__536C85E40C6D19C8] 
ON [dbo].[Watchmen]([Username] ASC) WHERE [Username] IS NOT NULL;
GO

-- Table: Shifts
CREATE TABLE [dbo].[Shifts](
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [WatchmanId] UNIQUEIDENTIFIER NULL,
    [EntryTime] TIME(7) NULL,
    [ExitTime] TIME(7) NULL,
    [GraceMinutes] INT NULL,
    [HalfDayAfterMinutes] INT NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [DF_Shifts_IsActive] DEFAULT ((1)),
    CONSTRAINT [PK__Shifts__3214EC07D30D868D] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- Table: WatchmanShifts
CREATE TABLE [dbo].[WatchmanShifts](
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [WatchmanId] UNIQUEIDENTIFIER NOT NULL,
    [EntryTime] TIME(7) NOT NULL,
    [ExitTime] TIME(7) NOT NULL,
    [GraceMinutes] INT NOT NULL CONSTRAINT [DF_WatchmanShifts_GraceMinutes] DEFAULT ((0)),
    [HalfDayAfterMinutes] INT NOT NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [DF_WatchmanShifts_IsActive] DEFAULT ((1)),
    [CreatedAt] DATETIME NULL CONSTRAINT [DF_WatchmanShifts_CreatedAt] DEFAULT (GETDATE()),
    CONSTRAINT [PK__Watchman__3214EC0729F3B00C] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- Table: AttendanceLogs
CREATE TABLE [dbo].[AttendanceLogs](
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [WatchmanId] UNIQUEIDENTIFIER NULL,
    [PhotoPath] NVARCHAR(255) NULL,
    [Latitude] DECIMAL(9, 6) NULL,
    [Longitude] DECIMAL(9, 6) NULL,
    [CreatedAt] DATETIME2(7) NULL CONSTRAINT [DF_AttendanceLogs_CreatedAt] DEFAULT (GETDATE()),
    [IsDeleted] BIT NOT NULL CONSTRAINT [DF_AttendanceLogs_IsDeleted] DEFAULT ((0)),
    [DeletedAt] DATETIME NULL,
    [DeletedBy] UNIQUEIDENTIFIER NULL,
    [AttendanceDate] DATE NULL,
    [Status] NVARCHAR(20) NULL,
    [ApprovedBy] UNIQUEIDENTIFIER NULL,
    [ApprovedAt] DATETIME NULL,
    CONSTRAINT [PK__Attendan__3214EC074D64A9EC] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- Table: AttendanceRequests
CREATE TABLE [dbo].[AttendanceRequests](
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [AttendanceDate] DATE NULL,
    [WatchmanId] UNIQUEIDENTIFIER NULL,
    [Reason] NVARCHAR(200) NULL,
    [Type] NVARCHAR(20) NULL,
    [Status] NVARCHAR(20) NULL,
    [CreatedAt] DATETIME NULL CONSTRAINT [DF_AttendanceRequests_CreatedAt] DEFAULT (GETDATE()),
    [ExpectedTime] SMALLDATETIME NULL,
    CONSTRAINT [PK__Attendan__3214EC07580742F9] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- ==============================================
-- STEP 3: INSERT DATA
-- ==============================================
-- Note: Run the following SELECT statements to get the current data,
-- then manually create INSERT statements based on your actual data

-- Get Admins data
SELECT 
    'INSERT INTO [dbo].[Admins] ([Id], [Username], [PasswordHash]) VALUES (''' + 
    CAST([Id] AS VARCHAR(36)) + ''', ' + 
    CASE WHEN [Username] IS NULL THEN 'NULL' ELSE 'N''' + [Username] + '''' END + ', ' +
    CASE WHEN [PasswordHash] IS NULL THEN 'NULL' ELSE 'N''' + [PasswordHash] + '''' END + ');'
FROM [dbo].[Admins];
GO

-- Injected admin row
INSERT INTO [dbo].[Admins] ([Id], [Username], [PasswordHash]) VALUES ('C74182CF-9AD6-4ACE-B378-3EBE7027D30E', N'admin@surge.in', N'$2a$12$kxDRqPwsC33dt0CWKULuGeXveV3hdghGulqUYMO7zYZsxuctrf2l.');

-- ----------------------------------------------------------------
--  2. Watchmen
-- ----------------------------------------------------------------
CREATE TABLE Watchmen (
    Id            UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    FullName      NVARCHAR(256)    NOT NULL,
    Username      NVARCHAR(256)    NOT NULL UNIQUE,
    PasswordHash  NVARCHAR(512)    NOT NULL,
    IsActive      BIT              NOT NULL DEFAULT 1
);

-- ----------------------------------------------------------------
--  3. QR Locations
-- ----------------------------------------------------------------
CREATE TABLE QrLocations (
    Id                   UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    LocationName         NVARCHAR(256)    NOT NULL,
    Latitude             DECIMAL(10, 7)   NOT NULL,
    Longitude            DECIMAL(10, 7)   NOT NULL,
    AllowedRadiusMeters  INT              NOT NULL DEFAULT 100,
    QrToken              NVARCHAR(512)    NOT NULL UNIQUE,
    IsActive             BIT              NOT NULL DEFAULT 1,
    CreatedAt            DATETIME         NOT NULL DEFAULT GETDATE()
);

-- ----------------------------------------------------------------
--  4. Attendance Logs
-- ----------------------------------------------------------------
CREATE TABLE AttendanceLogs (
    Id              UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    WatchmanId      UNIQUEIDENTIFIER NOT NULL REFERENCES Watchmen(Id),
    PhotoPath       NVARCHAR(512)    NULL,
    Latitude        DECIMAL(10, 7)   NULL,
    Longitude       DECIMAL(10, 7)   NULL,
    AttendanceDate  DATE             NOT NULL,
    Status          NVARCHAR(50)     NOT NULL DEFAULT 'Present',
    CreatedAt       DATETIME         NOT NULL DEFAULT GETDATE(),
    IsDeleted       BIT              NOT NULL DEFAULT 0,
    ApprovedBy      UNIQUEIDENTIFIER NULL REFERENCES Admins(Id),
    ApprovedAt      DATETIME         NULL
);

-- ----------------------------------------------------------------
--  5. Attendance Requests (correction requests from watchmen)
-- ----------------------------------------------------------------
CREATE TABLE AttendanceRequests (
    Id              UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    WatchmanId      UNIQUEIDENTIFIER NOT NULL REFERENCES Watchmen(Id),
    AttendanceDate  DATE             NOT NULL,
    Reason          NVARCHAR(1000)   NOT NULL,
    Type            NVARCHAR(50)     NOT NULL,   -- LateArrival / HalfDay
    ExpectedTime    NVARCHAR(50)     NULL,
    Status          NVARCHAR(50)     NOT NULL DEFAULT 'Pending',  -- Pending / Approved / Rejected
    CreatedAt       DATETIME         NOT NULL DEFAULT GETDATE()
);

-- ----------------------------------------------------------------
--  6. Shifts
-- ----------------------------------------------------------------
CREATE TABLE Shifts (
    Id                   UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    WatchmanId           UNIQUEIDENTIFIER NOT NULL REFERENCES Watchmen(Id),
    EntryTime            TIME             NOT NULL,
    ExitTime             TIME             NOT NULL,
    GraceMinutes         INT              NOT NULL DEFAULT 15,
    HalfDayAfterMinutes  INT              NOT NULL DEFAULT 120,
    IsActive             BIT              NOT NULL DEFAULT 1
);

-- ----------------------------------------------------------------
--  7. Admin Audit Logs
-- ----------------------------------------------------------------
CREATE TABLE AdminAuditLogs (
    Id           UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    AdminId      UNIQUEIDENTIFIER NOT NULL REFERENCES Admins(Id),
    AdminName    NVARCHAR(256)    NOT NULL,
    Action       NVARCHAR(256)    NOT NULL,
    TableName    NVARCHAR(256)    NOT NULL,
    RecordId     UNIQUEIDENTIFIER NULL,
    Description  NVARCHAR(1000)   NULL,
    PerformedAt  DATETIME         NOT NULL DEFAULT GETDATE()
);

-- =============================================================
--  Seed: Default Admin Account
--
--  Username : admin@surge.com
--  Password : 12345678
--
--  PasswordHash is a BCrypt hash (cost 11) of "12345678".
--  Do NOT change it manually — the API verifies with BCrypt.
-- =============================================================
INSERT INTO Admins (Id, Username, PasswordHash)
VALUES (
    NEWID(),
    'admin@surge.com',
    '$2a$12$kxDRqPwsC33dt0CWKULuGeXveV3hdghGulqUYMO7zYZsxuctrf2l.'
);
