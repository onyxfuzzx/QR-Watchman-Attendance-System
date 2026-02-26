namespace WatchmanAttendance.API.DTOs;

public class CreateWatchmanRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

    public string isActive { get; set; } = string.Empty;
}
