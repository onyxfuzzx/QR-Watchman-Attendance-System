using Dapper;
using WatchmanAttendance.API.DTOs;
using WatchmanAttendance.API.Services;

public class WatchmanDashboardRepository
{
    private readonly DbConnectionFactory _db;
    private readonly TimeZoneService _timeZone;
    public WatchmanDashboardRepository(DbConnectionFactory db, TimeZoneService timeZone)
    {
        _db = db;
        _timeZone = timeZone;
    }

    public WatchmanDashboardDto GetDashboard(Guid watchmanId)
    {
        using var con = _db.Create();

        // 🔹 Watchman name
        var watchmanName = con.ExecuteScalar<string>(
    "SELECT FullName FROM Watchmen WHERE Id = @watchmanId",
    new { watchmanId }
);


        var (monthStartLocal, monthEndLocal) = _timeZone.GetMonthRangeLocal();

        //  Monthly attendance
        var attendance = con.Query<MonthlyAttendanceDto>(@"
            SELECT 
                CreatedAt AS Date,
                CreatedAt AS PunchTime,
                'Present' AS Status,
                CASE 
                    WHEN Latitude IS NOT NULL AND Longitude IS NOT NULL THEN 1
                    ELSE 0
                END AS LocationVerified
            FROM AttendanceLogs
            WHERE WatchmanId = @watchmanId
              AND IsDeleted = 0
                            AND CreatedAt >= @monthStartLocal
                            AND CreatedAt < @monthEndLocal
            ORDER BY CreatedAt DESC
                    ", new { watchmanId, monthStartLocal, monthEndLocal }).ToList();

        //  Recent activity (last 5)
        var activity = con.Query<ActivityDto>(@"
            SELECT TOP 5 CreatedAt AS Time
            FROM AttendanceLogs
            WHERE WatchmanId = @watchmanId
              AND IsDeleted = 0
            ORDER BY CreatedAt DESC
        ", new { watchmanId }).ToList();

        //  Summary
        var presentDays = attendance.Count;
        var daysInMonth = DateTime.DaysInMonth(monthStartLocal.Year, monthStartLocal.Month);

        return new WatchmanDashboardDto
        {
            WatchmanName = watchmanName,
            Summary = new DashboardSummaryDto
            {
                Month = monthStartLocal.ToString("MMMM yyyy"),
                PresentDays = presentDays,
                Percentage = daysInMonth == 0 ? 0 : (presentDays * 100) / daysInMonth,
                LastPunch = activity.FirstOrDefault()?.Time
            },
            Attendance = attendance,
            RecentActivity = activity
        };
    }
    public IEnumerable<dynamic> GetMonthlyChart(Guid watchmanId)
    {
        using var con = _db.Create();

        var (monthStartLocal, monthEndLocal) = _timeZone.GetMonthRangeLocal();

        return con.Query("""
        SELECT
            DAY(AttendanceDate) AS Day,
            COUNT(*) AS Count
        FROM AttendanceLogs
        WHERE WatchmanId = @watchmanId
          AND IsDeleted = 0
            AND AttendanceDate >= @monthStartLocal
            AND AttendanceDate < @monthEndLocal
        GROUP BY DAY(AttendanceDate)
        ORDER BY Day
        """, new { watchmanId, monthStartLocal, monthEndLocal });
    }
    public object GetAttendanceChart(Guid watchmanId)
    {
        using var con = _db.Create();

        var result = con.QuerySingle("""
        SELECT
            SUM(CASE WHEN Status = 'Present' THEN 1 ELSE 0 END) AS Present,
            SUM(CASE WHEN Status = 'Late' THEN 1 ELSE 0 END) AS Late,
            SUM(CASE WHEN Status = 'HalfDay' THEN 1 ELSE 0 END) AS HalfDay
        FROM AttendanceLogs
        WHERE WatchmanId = @watchmanId
          AND IsDeleted = 0
    """, new { watchmanId });

        return result;
    }


}
