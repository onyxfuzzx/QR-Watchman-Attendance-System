namespace WatchmanAttendance.API.Models;

public class AttendanceChangeRequest
{
    public Guid Id { get; set; }
    public Guid WatchmanId { get; set; }

    public DateTime AttendanceDate { get; set; }
    public string Reason { get; set; } = "";
    public string Type { get; set; } = "";   // Late / HalfDay
    public string Status { get; set; } = ""; // Pending / Approved / Rejected
    public string? ExpectedTime { get; set; }
    public DateTime CreatedAt { get; set; }
}
