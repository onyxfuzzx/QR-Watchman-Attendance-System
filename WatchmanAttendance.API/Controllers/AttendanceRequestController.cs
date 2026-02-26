using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WatchmanAttendance.API.DTOs;
using WatchmanAttendance.API.Models;
using WatchmanAttendance.API.Repositories;
using WatchmanAttendance.API.Services;


namespace WatchmanAttendance.API.Controllers
{
    [Authorize(Roles = "Watchman")]
    [ApiController]
    [Route("api/attendance/request")]
    public class AttendanceRequestController : ControllerBase
    {
        private readonly AttendanceRequestRepository _repo;
        private readonly TimeZoneService _timeZone;

        public AttendanceRequestController(AttendanceRequestRepository repo, TimeZoneService timeZone)
        {
            _repo = repo;
            _timeZone = timeZone;
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateAttendanceRequest req)
        {
            var watchmanId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            TimeSpan? expectedTime = null;

            if (!string.IsNullOrWhiteSpace(req.ExpectedTime))
            {
                if (!TimeSpan.TryParse(req.ExpectedTime, out var parsedTime))
                {
                    return BadRequest("Invalid ExpectedTime format. Use HH:mm");
                }

                expectedTime = parsedTime;
            }

            var localAttendanceDate = _timeZone.NormalizeToLocalDate(req.AttendanceDate);

            _repo.Create(new AttendanceChangeRequest
            {
                Id = Guid.NewGuid(),
                WatchmanId = watchmanId,
                AttendanceDate = localAttendanceDate,
                Type = req.Type,
                Reason = req.Reason,
                ExpectedTime = expectedTime
            });

            return Ok(new { meaage = "Request submitted" });
        }

        // Watchman views his requests
        [HttpGet]
        public IActionResult MyRequests()
        {
            var watchmanId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            return Ok(_repo.GetByWatchman(watchmanId));
        }
    }

}
