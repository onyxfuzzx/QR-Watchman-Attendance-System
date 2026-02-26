namespace WatchmanAttendance.API.DTOs;

public class CreateQrLocationRequest
{
    public string LocationName { get; set; } = "";
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public int Radius { get; set; }   
}
