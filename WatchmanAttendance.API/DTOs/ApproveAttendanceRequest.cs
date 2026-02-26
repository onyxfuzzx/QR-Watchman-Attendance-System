namespace WatchmanAttendance.API.DTOs
{
    public class ApproveAttendanceRequest
    {
        public Guid AttendanceId { get; set; }
        public string NewStatus { get; set; } = "";
    }

}
