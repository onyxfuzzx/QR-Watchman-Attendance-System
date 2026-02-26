using Dapper;
using WatchmanAttendance.API.Models;
using WatchmanAttendance.API.Services;

namespace WatchmanAttendance.API.Repositories;

public class ShiftRepository
{
    private readonly DbConnectionFactory _db;
    private readonly AdminAuditRepository _audit;

    public ShiftRepository(DbConnectionFactory db, AdminAuditRepository audit)
    {
        _db = db;
        _audit = audit;
    }



    //  Get active shift for watchman
    public Shift? GetShiftForWatchman(Guid watchmanId)
    {
        using var con = _db.Create();

        return con.QueryFirstOrDefault<Shift>(
            """
        SELECT *
        FROM Shifts
        WHERE WatchmanId = @watchmanId
        """,
            new { watchmanId }
        );
    }

    public void AssignShiftWithHistory(Shift newShift, Guid adminId, string adminName)
    {
        using var con = _db.Create();
        con.Open(); // ✅ REQUIRED

        using var tx = con.BeginTransaction();

        try
        {
            // 1️⃣ Deactivate existing active shift
            con.Execute("""
            UPDATE Shifts
            SET IsActive = 0
            WHERE WatchmanId = @WatchmanId
              AND IsActive = 1
        """, new { newShift.WatchmanId }, tx);

            // 2️⃣ Insert new shift
            con.Execute("""
            INSERT INTO Shifts
            (Id, WatchmanId, EntryTime, ExitTime, GraceMinutes, HalfDayAfterMinutes, IsActive)
            VALUES
            (@Id, @WatchmanId, @EntryTime, @ExitTime, @GraceMinutes, @HalfDayAfterMinutes, 1)
        """, new
            {
                newShift.Id,
                newShift.WatchmanId,
                newShift.EntryTime,
                newShift.ExitTime,
                newShift.GraceMinutes,
                newShift.HalfDayAfterMinutes
            }, tx);

            // AUDIT
            _audit.Log(
                adminId,
                adminName,
                "ASSIGNED   SHIFT",
                "Shifts",
                newShift.Id,
                $"Shift assigned {newShift.EntryTime}-{newShift.ExitTime}"
            );

            tx.Commit(); // ✅
        }
        catch
        {
            tx.Rollback(); // ✅
            throw;
        }
    }



    public void UpsertShift(Shift shift)
    {
        using var con = _db.Create();

        // 1️⃣ Try update first
        var rowsAffected = con.Execute(@"
        UPDATE Shifts
        SET
            EntryTime = @EntryTime,
            ExitTime = @ExitTime,
            GraceMinutes = @GraceMinutes,
            HalfDayAfterMinutes = @HalfDayAfterMinutes
        WHERE WatchmanId = @WatchmanId
          AND IsActive = 1
    ", shift);

        // 2️⃣ If no active shift → insert
        if (rowsAffected == 0)
        {
            con.Execute(@"
            INSERT INTO Shifts
            (Id, WatchmanId, EntryTime, ExitTime, GraceMinutes, HalfDayAfterMinutes, IsActive)
            VALUES
            (@Id, @WatchmanId, @EntryTime, @ExitTime, @GraceMinutes, @HalfDayAfterMinutes, 1)
        ", shift);
        }
    }

    //  Assign / Update shift (Admin)
    public void AssignShift(Shift shift)
    {
        using var con = _db.Create();

        con.Execute("""
        INSERT INTO Shifts
        (
            Id,
            WatchmanId,
            EntryTime,
            ExitTime,
            GraceMinutes,
            HalfDayAfterMinutes,
            IsActive
        )
        VALUES
        (
            @Id,
            @WatchmanId,
            @EntryTime,
            @ExitTime,
            @GraceMinutes,
            @HalfDayAfterMinutes,
            1
        )
    """, shift);
    }

    public IEnumerable<dynamic> GetShiftHistory(Guid watchmanId)
    {
        using var con = _db.Create();

        return con.Query("""
        SELECT
            s.EntryTime,
            s.ExitTime,
            s.GraceMinutes,
            s.HalfDayAfterMinutes,
            s.IsActive,
            s.Id
        FROM Shifts s
        WHERE s.WatchmanId = @watchmanId
        ORDER BY s.Id DESC
    """, new { watchmanId });
    }



    //  Admin view
    public IEnumerable<dynamic> GetAll()
    {
        using var con = _db.Create();

        return con.Query("""
        SELECT
            s.Id,
            s.WatchmanId,
            w.FullName,
            s.EntryTime,
            s.ExitTime,
            s.GraceMinutes,
            s.HalfDayAfterMinutes,
            s.IsActive
        FROM Shifts s
        JOIN Watchmen w ON w.Id = s.WatchmanId
        WHERE s.IsActive = 1
        ORDER BY w.FullName
    """);
    }


}
