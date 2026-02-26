using Dapper;
using WatchmanAttendance.API.Models;
using WatchmanAttendance.API.Services;

namespace WatchmanAttendance.API.Repositories;

public class AttendanceRequestRepository
{
    private readonly DbConnectionFactory _db;

    public AttendanceRequestRepository(DbConnectionFactory db)
    {
        _db = db;
    }

    public void Create(AttendanceChangeRequest req)
    {
        using var con = _db.Create();
        con.Execute("""
            INSERT INTO AttendanceRequests
        (Id, AttendanceDate, WatchmanId, Reason, Type, ExpectedTime, Status, CreatedAt)
        VALUES
        (@Id, @AttendanceDate, @WatchmanId, @Reason, @Type, @ExpectedTime, 'Pending', DATEADD(MINUTE, 330, GETUTCDATE()))
        """, req);
    }
    public AttendanceChangeRequest? GetApprovedLateArrival(Guid watchmanId, DateTime date)
    {
        using var con = _db.Create();

        return con.QueryFirstOrDefault<AttendanceChangeRequest>("""
        SELECT *
        FROM AttendanceRequests
        WHERE WatchmanId = @watchmanId
          AND AttendanceDate = @date
          AND Type = 'LateArrival'
          AND Status = 'Approved'
    """, new { watchmanId, date });
    }

    //  Watchman view (OWN requests)
    public IEnumerable<AttendanceChangeRequest> GetByWatchman(Guid watchmanId)
    {
        using var con = _db.Create();
        return con.Query<AttendanceChangeRequest>("""
            SELECT *
            FROM AttendanceRequests
            WHERE WatchmanId = @watchmanId
            ORDER BY CreatedAt DESC
        """, new { watchmanId });
    }

    //  Admin view (ALL pending)
    public IEnumerable<AttendanceChangeRequest> GetPending()
    {
        using var con = _db.Create();
        return con.Query<AttendanceChangeRequest>("""
            SELECT *
            FROM AttendanceRequests
            WHERE Status = 'Pending'
            ORDER BY CreatedAt
        """);
    }



    public AttendanceChangeRequest? GetById(Guid id)
    {
        using var con = _db.Create();
        return con.QueryFirstOrDefault<AttendanceChangeRequest>(
            "SELECT * FROM AttendanceRequests WHERE Id = @id",
            new { id }
        );
    }

    //  Admin approve/reject
    public void UpdateStatus(Guid id, string status)
    {
        using var con = _db.Create();
        con.Execute("""
            UPDATE AttendanceRequests
            SET Status = @status
            WHERE Id = @id
        """, new { id, status });
    }
}
