using Dapper;
using WatchmanAttendance.API.Services;
using WatchmanAttendance.API.Models;

public class AttendanceRepository
{
    private readonly DbConnectionFactory _db;
    public AttendanceRepository(DbConnectionFactory db) => _db = db;


    public void Insert(AttendanceLog log)
    {
        using var con = _db.Create();

        con.Execute("""
        INSERT INTO AttendanceLogs
        (
            Id,
            WatchmanId,
            PhotoPath,
            Latitude,
            Longitude,
            AttendanceDate,
            Status,
            CreatedAt,
            IsDeleted
        )
        VALUES
        (
            @Id,
            @WatchmanId,
            @PhotoPath,
            @Latitude,
            @Longitude,
            @AttendanceDate,
            @Status,
            @CreatedAt,
            @IsDeleted
        )
    """, log);
    }


    public bool HasAttendanceForDate(Guid watchmanId, DateTime date)
    {
        using var con = _db.Create();
        return con.ExecuteScalar<int>(@"
        SELECT COUNT(1)
        FROM AttendanceLogs
        WHERE WatchmanId = @watchmanId
          AND AttendanceDate = @date
          AND IsDeleted = 0
    ", new { watchmanId, date }) > 0;
    }
    public void ApproveAttendance(Guid attendanceId, string status, Guid adminId)
    {
        using var con = _db.Create();
        con.Execute("""
        UPDATE AttendanceLogs
        SET Status = @status,
            ApprovedBy = @adminId,
            ApprovedAt = DATEADD(MINUTE, 330, GETUTCDATE())
        WHERE Id = @attendanceId
    """, new { attendanceId, status, adminId });
    }
    public void InsertApprovedAttendance(
    Guid watchmanId,
    DateTime attendanceDate,
    string status,
    Guid adminId
)
    {
        using var con = _db.Create();

        con.Execute("""
        INSERT INTO AttendanceLogs
        (
            Id,
            WatchmanId,
            AttendanceDate,
            Status,
            ApprovedBy,
            ApprovedAt,
            CreatedAt,
            IsDeleted
        )
        VALUES
        (
            NEWID(),
            @watchmanId,
            @attendanceDate,
            @status,
            @adminId,
            DATEADD(MINUTE, 330, GETUTCDATE()),
            DATEADD(MINUTE, 330, GETUTCDATE()),
            0
        )
    """, new { watchmanId, attendanceDate, status, adminId });
    }

    public void ApproveAttendanceByDate(
    Guid watchmanId,
    DateTime date,
    string status,
    Guid adminId
)
    {
        using var con = _db.Create();

        con.Execute("""
        UPDATE AttendanceLogs
        SET
            Status = @status,
            ApprovedBy = @adminId,
            ApprovedAt = DATEADD(MINUTE, 330, GETUTCDATE())
        WHERE
            WatchmanId = @watchmanId
            AND AttendanceDate = @date
            AND IsDeleted = 0
    """, new { watchmanId, date, status, adminId });
    }

    public bool HasRecentAttendance(Guid watchmanId, int minutes)
    {
        using var con = _db.Create();
        return con.ExecuteScalar<int>(
            """
        SELECT COUNT(*)
        FROM AttendanceLogs
        WHERE WatchmanId = @id
                    AND CreatedAt >= DATEADD(MINUTE, -@min, DATEADD(MINUTE, 330, GETUTCDATE()))
        """,
            new { id = watchmanId, min = minutes }
        ) > 0;
    }
    public IEnumerable<AttendanceLog> GetHistory(Guid watchmanId)
    {
        using var con = _db.Create();

        return con.Query<AttendanceLog>("""
        SELECT *
        FROM AttendanceLogs
        WHERE WatchmanId = @watchmanId
          AND IsDeleted = 0
        ORDER BY AttendanceDate DESC, CreatedAt DESC
    """, new { watchmanId });
    }


}
