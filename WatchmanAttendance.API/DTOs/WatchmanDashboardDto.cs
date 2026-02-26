public class WatchmanDashboardDto
{
    public string WatchmanName { get; set; } = "";

    public DashboardSummaryDto Summary { get; set; } = new();

    public List<MonthlyAttendanceDto> Attendance { get; set; } = new();

    public List<ActivityDto> RecentActivity { get; set; } = new();
}

public class DashboardSummaryDto
{
    public string Month { get; set; } = "";
    public int PresentDays { get; set; }
    public int Percentage { get; set; }
    public DateTime? LastPunch { get; set; }
}

public class MonthlyAttendanceDto
{
    public DateTime Date { get; set; }
    public DateTime PunchTime { get; set; }
    public string Status { get; set; } = "";
    public bool LocationVerified { get; set; }
}

public class ActivityDto
{
    public DateTime Time { get; set; }
}
