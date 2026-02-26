using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.NetworkInformation;
using System.Security.Claims;
using WatchmanAttendance.API.DTOs;
using WatchmanAttendance.API.Models;
using WatchmanAttendance.API.Repositories;
using WatchmanAttendance.API.Services;



namespace WatchmanAttendance.API.Controllers;

[Authorize(Roles = "Watchman")]
[ApiController]
[Route("api/attendance")]
public class AttendanceController : ControllerBase
{
    private readonly AttendanceRepository _repo;
    private readonly QrLocationRepository _qrRepo;
    private readonly ShiftRepository _shiftRepo;
    private readonly AttendanceRequestRepository _attendanceReqRepo;
    private readonly TimeZoneService _timeZone;


    public AttendanceController(
        AttendanceRepository repo,
        QrLocationRepository qrRepo,
        ShiftRepository shiftRepo,
        AttendanceRequestRepository attendanceReqRepo,
        TimeZoneService timeZone)
    {
        _repo = repo;
        _qrRepo = qrRepo;
        _shiftRepo = shiftRepo;
        _attendanceReqRepo = attendanceReqRepo;
        _timeZone = timeZone;
        
    }

    [HttpPost("mark")]
    public async Task<IActionResult> Mark([FromForm] AttendanceMarkRequest req)
    {


        var watchmanId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        if (_repo.HasRecentAttendance(watchmanId, 10))
            return BadRequest("Attendance already marked recently");

        var today = _timeZone.LocalToday;

        if (_repo.HasAttendanceForDate(watchmanId, today))
            return BadRequest("Attendance already marked for today");

        var qr = _qrRepo.GetById(req.LocationId);
        if (qr == null)
            return BadRequest("Invalid QR location");

        var approvedLateRequest =
    _attendanceReqRepo.GetApprovedLateArrival(watchmanId, today);

        bool allowLateWithoutPenalty = approvedLateRequest != null;

        var distance = GeoService.DistanceInMeters(
            (double)req.Latitude,
            (double)req.Longitude,
            (double)qr.Latitude,
            (double)qr.Longitude
        );

        if (distance > qr.AllowedRadiusMeters)
            return BadRequest($"You are too far from location ({Math.Round(distance)}m)");

        if (req.Photo == null || req.Photo.Length == 0)
            return BadRequest("Photo is required");

        var shift = _shiftRepo.GetShiftForWatchman(watchmanId);
        if (shift == null)
            return BadRequest("Shift not assigned. Contact admin.");

        var now = _timeZone.LocalNow;
        var shiftStart = today.Add(shift.EntryTime);
        var shiftEnd = today.Add(shift.ExitTime);

        if (now > shiftEnd)
            return BadRequest("Attendance window closed");

        var lateMinutes = (int)(now - shiftStart).TotalMinutes;

        string status = "Present";
        if (!allowLateWithoutPenalty)
        {
            if (lateMinutes > shift.GraceMinutes)
                status = "Late";

            if (lateMinutes > shift.HalfDayAfterMinutes)
                status = "HalfDay";
        }


        // Save photo
        var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
        Directory.CreateDirectory(uploadDir);

        var fileName = $"{Guid.NewGuid()}.jpg";
        var filePath = Path.Combine(uploadDir, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await req.Photo.CopyToAsync(stream);
        }

        _repo.Insert(new AttendanceLog
        {
            Id = Guid.NewGuid(),
            WatchmanId = watchmanId,
            PhotoPath = $"Uploads/{fileName}",
            Latitude = req.Latitude,
            Longitude = req.Longitude,
            AttendanceDate = today,
            Status = status,
            CreatedAt = _timeZone.LocalNow
        });

        return Ok(new
        {
            message = "Attendance marked successfully",
            status,
            distance = Math.Round(distance)
        });
    }
    [HttpGet("history")]
    public IActionResult History()
    {
        var watchmanId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        return Ok(_repo.GetHistory(watchmanId));
    }


}