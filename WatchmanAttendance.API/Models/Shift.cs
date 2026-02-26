namespace WatchmanAttendance.API.Models
{
    public class Shift
    {
        public Guid Id { get; set; }
        public Guid WatchmanId { get; set; }

        public TimeSpan EntryTime { get; set; }
        public TimeSpan ExitTime { get; set; }

        public int GraceMinutes { get; set; }
        public int HalfDayAfterMinutes { get; set; }

        public bool IsActive { get; set; }
    }

}
