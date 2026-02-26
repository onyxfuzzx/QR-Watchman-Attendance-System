using Microsoft.AspNetCore.Http;

namespace WatchmanAttendance.API.DTOs;

public class AttendanceMarkRequest
{
    public Guid LocationId { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }

    public IFormFile Photo { get; set; } = null!;
}
