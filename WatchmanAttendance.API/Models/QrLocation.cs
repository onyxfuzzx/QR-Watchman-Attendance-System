namespace WatchmanAttendance.API.Models;

public class QrLocation
{
    public Guid Id { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string QrToken { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int AllowedRadiusMeters { get; set; }    

}
