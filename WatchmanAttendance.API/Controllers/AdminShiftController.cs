using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WatchmanAttendance.API.DTOs;
using WatchmanAttendance.API.Models;
using WatchmanAttendance.API.Repositories;


namespace WatchmanAttendance.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin/shift")]
    public class AdminShiftController : ControllerBase
    {
        private readonly ShiftRepository _repo;

        public AdminShiftController(ShiftRepository repo)
        {
            _repo = repo;
        }

        //[HttpPost("assign")]
        //public IActionResult Assign([FromBody] AssignShiftRequest req)
        //{
        //    if (!TimeSpan.TryParse(req.EntryTime, out var entryTime))
        //        return BadRequest("Invalid entryTime format. Use HH:mm");

        //    if (!TimeSpan.TryParse(req.ExitTime, out var exitTime))
        //        return BadRequest("Invalid exitTime format. Use HH:mm");

        //    _repo.AssignShift(new Shift
        //    {
        //        Id = Guid.NewGuid(),
        //        WatchmanId = req.WatchmanId,
        //        EntryTime = entryTime,
        //        ExitTime = exitTime,
        //        GraceMinutes = req.GraceMinutes,
        //        HalfDayAfterMinutes = req.HalfDayAfterMinutes
        //    });

        //    return Ok(new { message = "Shift assigned successfully" });

        //}

        [HttpPost("assign")]
        public IActionResult Assign(AssignShiftRequest req)
        {
            var adminId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var adminName = User.FindFirstValue("name")!;

            var shift = new Shift
            {
                Id = Guid.NewGuid(),
                WatchmanId = req.WatchmanId,
                EntryTime = TimeSpan.Parse(req.EntryTime),
                ExitTime = TimeSpan.Parse(req.ExitTime),
                GraceMinutes = req.GraceMinutes,
                HalfDayAfterMinutes = req.HalfDayAfterMinutes
            };

            _repo.AssignShiftWithHistory(shift, adminId, adminName);

            return Ok();
        }


        [HttpGet("history/{watchmanId}")]
        public IActionResult ShiftHistory(Guid watchmanId)
        {
            return Ok(_repo.GetShiftHistory(watchmanId));
        }


        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_repo.GetAll());
        }

    }

}
