namespace WatchmanAttendance.API.DTOs;

public class CreateAttendanceRequest
{
    public DateTime AttendanceDate { get; set; }
    public string Reason { get; set; } = "";
    public string Type { get; set; } = ""; // Late / HalfDay
    public string? ExpectedTime { get; set; }

}   
