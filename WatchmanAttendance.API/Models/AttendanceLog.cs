namespace WatchmanAttendance.API.Models;

public class AttendanceLog
{
    public Guid Id { get; set; }
    public Guid WatchmanId { get; set; }
    public string PhotoPath { get; set; } = string.Empty;
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public DateTime AttendanceDate { get; set; }
    public string Status { get; set; } = "Present";

    public DateTime CreatedAt { get; set; }
    public bool IsDeleted { get; set; } = false;
    public Guid? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
}
