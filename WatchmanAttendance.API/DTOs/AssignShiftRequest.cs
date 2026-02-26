namespace WatchmanAttendance.API.DTOs
{
    public class AssignShiftRequest
    {
        public Guid WatchmanId { get; set; }
        public string EntryTime { get; set; } = null!;
        public string ExitTime { get; set; } = null!;
        public int GraceMinutes { get; set; }
        public int HalfDayAfterMinutes { get; set; }
    }

}
