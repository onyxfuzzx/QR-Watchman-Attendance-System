using Dapper;
using System.Data;
using WatchmanAttendance.API.Models;
using WatchmanAttendance.API.Services;

namespace WatchmanAttendance.API.Repositories;

public class AdminRepository
{
    private readonly DbConnectionFactory _db;

    public AdminRepository(DbConnectionFactory db)
    {
        _db = db;
    }

    // ================= ATTENDANCE =================

    public IEnumerable<dynamic> GetAttendance()
    {
        using var con = _db.Create();

        return con.Query("""
            SELECT 
                a.Id,
                w.FullName,
                a.CreatedAt,
                a.PhotoPath,
                a.Latitude,
                a.Longitude
            FROM AttendanceLogs a
            JOIN Watchmen w ON w.Id = a.WatchmanId
            WHERE a.IsDeleted = 0
            ORDER BY a.CreatedAt DESC
        """);
    }
    // ================= AUDIT =================

    public IEnumerable<dynamic> GetAuditLogs()
    {
        using var con = _db.Create();
        return con.Query("""
        SELECT 
        a.Id,
        a.Action,
        a.TableName,
        a.RecordId,
        a.PerformedAt,
        u.Username AS AdminName
    FROM AdminAuditLogs a
    JOIN Admins u ON u.Id = a.AdminId
    ORDER BY a.PerformedAt DESC
    """);
    }

    public void Log(
    Guid adminId,
    string adminName,
    string action,
    string table,
    Guid recordId,
    string description)
    {
        using var con = _db.Create();

        con.Execute(@"
        INSERT INTO AdminAuditLogs
        (Id, AdminId, AdminName, Action, TableName, RecordId, Description, PerformedAt)
        VALUES
        (@Id, @AdminId, @AdminName, @Action, @TableName, @RecordId, @Description, DATEADD(MINUTE, 330, GETUTCDATE()))
    ", new
        {
            Id = Guid.NewGuid(),
            adminId,
            adminName,
            action,
            table,
            recordId,
            description
        });
    }

    // ================= DELETE =================
    public void SoftDelete(Guid attendanceId)
    {
        using var con = _db.Create();

        con.Execute("""
        UPDATE AttendanceLogs
        SET IsDeleted = 1
        WHERE Id = @Id
    """, new { Id = attendanceId });
    }



    public void BulkDelete(IEnumerable<Guid> ids)
    {
        using var con = _db.Create();

        con.Execute("""
        UPDATE AttendanceLogs
        SET IsDeleted = 1
        WHERE Id IN @Ids
    """, new { Ids = ids });
    }



    // ================= WATCHMEN =================

    public void CreateWatchman(Watchman w)
    {
        using var con = _db.Create();

        con.Execute("""
            INSERT INTO Watchmen
            (Id, FullName, Username, PasswordHash, IsActive)
            VALUES (@Id, @FullName, @Username, @PasswordHash, 1)
        """, w);
    }

    public void DisableWatchman(Guid id)
    {
        using var con = _db.Create();

        con.Execute("""
            UPDATE Watchmen
            SET IsActive = 0
            WHERE Id = @id
        """, new { id });
    }

    
}
