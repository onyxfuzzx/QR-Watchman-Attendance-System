using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchmanAttendance.API.DTOs;
using WatchmanAttendance.API.Models;
using WatchmanAttendance.API.Repositories;
using System.Security.Claims;

namespace WatchmanAttendance.API.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly WatchmanRepository _watchmen;
    private readonly AdminRepository _admin;
    private readonly AdminAuditRepository _audit;

    public AdminController(
        AdminRepository admin,
        WatchmanRepository watchmen,
        AdminAuditRepository audit
    )
    {
        _admin = admin;
        _watchmen = watchmen;
        _audit = audit;
    }

    // ================= HELPERS =================
    private Guid AdminId =>
        Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    private string AdminName =>
        User.FindFirst("name")?.Value ?? "Admin";

    // ================= WATCHMEN =================

    [HttpPost("watchman")]
    public IActionResult CreateWatchman(CreateWatchmanRequest req)
    {
        var watchman = new Watchman
        {
            Id = Guid.NewGuid(),
            FullName = req.FullName,
            Username = req.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            IsActive = true
        };

        _watchmen.Create(watchman);

        _audit.Log(
            AdminId,
            AdminName,
            "CREATE",
            "Watchmen",
            watchman.Id,
            $"Watchman '{watchman.FullName}' created"
        );

        return Ok(new { message = "Watchman created" });
    }

    [HttpGet("watchmen")]
    public IActionResult GetWatchmen()
    {
        return Ok(_watchmen.GetAllWatchmen());
    }

    [HttpPost("watchman/disable/{id}")]
    public IActionResult Disable(Guid id)
    {
        _watchmen.SetWatchmanStatus(id, false);

        _audit.Log(
            AdminId,
            AdminName,
            "DISABLE",
            "Watchmen",
            id,
            "Watchman account disabled"
        );

        return Ok();
    }

    [HttpPost("watchman/enable/{id}")]
    public IActionResult Enable(Guid id)
    {
        _watchmen.SetWatchmanStatus(id, true);

        _audit.Log(
            AdminId,
            AdminName,
            "ENABLE",
            "Watchmen",
            id,
            "Watchman account enabled"
        );

        return Ok();
    }

    // ================= ATTENDANCE =================

    [HttpGet("attendance")]
    public IActionResult Attendance()
    {
        return Ok(_admin.GetAttendance());
    }

    [HttpDelete("attendance/{id}")]
    public IActionResult DeleteAttendance(Guid id)
    {
        _admin.SoftDelete(id);

        _audit.Log(
            AdminId,
            AdminName,
            "DELETE",
            "AttendanceLogs",
            id,
            "Attendance record soft-deleted"
        );

        return Ok(new { message = "Attendance deleted" });
    }

    [HttpPost("attendance/bulk-delete")]
    public IActionResult BulkDeleteAttendance([FromBody] Guid[] ids)
    {
        _admin.BulkDelete(ids);

        foreach (var id in ids)
        {
            _audit.Log(
                AdminId,
                AdminName,
                "BULK_DELETE",
                "AttendanceLogs",
                id,
                "Attendance record deleted in bulk operation"
            );
        }

        return Ok(new { message = "Attendance records deleted" });
    }

    // ================= AUDIT =================

    [HttpGet("audit")]
    public IActionResult GetAuditLogs()
    {
        return Ok(_admin.GetAuditLogs());
    }
}




//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using WatchmanAttendance.API.DTOs;
//using WatchmanAttendance.API.Models;
//using WatchmanAttendance.API.Repositories;
//using System.Security.Claims;


//namespace WatchmanAttendance.API.Controllers;

//[Authorize(Roles = "Admin")]
//[ApiController]
//[Route("api/admin")]
//public class AdminController : ControllerBase
//{
//    private readonly WatchmanRepository _watchmen;
//    private readonly AdminRepository _admin; // attendance only
//    private Guid GetAdminId()
//    {
//        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
//        return Guid.Parse(claim!.Value);
//    }

//    public AdminController(
//        AdminRepository admin,
//        WatchmanRepository watchmen
//    )
//    {
//        _admin = admin;
//        _watchmen = watchmen;
//    }

//    //CREATE WATCHMAN
//    [HttpPost("watchman")]
//    public IActionResult CreateWatchman(CreateWatchmanRequest req)
//    {
//        var watchman = new Watchman
//        {
//            Id = Guid.NewGuid(),
//            FullName = req.FullName,
//            Username = req.Username,
//            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
//            IsActive = true
//        };

//        _watchmen.Create(watchman);
//        return Ok(new { message = "Watchman created" });
//    }

//    //  GET ALL WATCHMEN 
//    [HttpGet("watchmen")]
//    public IActionResult GetWatchmen()
//    {
//        return Ok(_watchmen.GetAllWatchmen());
//    }

//    //  ENABLE / DISABLE 
//    [HttpPost("watchman/disable/{id}")]
//    public IActionResult Disable(Guid id)
//    {
//        _watchmen.SetWatchmanStatus(id, false);
//        return Ok();
//    }

//    [HttpPost("watchman/enable/{id}")]
//    public IActionResult Enable(Guid id)
//    {
//        _watchmen.SetWatchmanStatus(id, true);
//        return Ok();
//    }

//    //ATTENDANCE LOGS
//    [HttpGet("attendance")]
//    public IActionResult Attendance()
//    {
//        return Ok(_admin.GetAttendance());
//    }

//    //DELETE SINGLE ATTENDANCE
//    [HttpDelete("attendance/{id}")]
//    public IActionResult DeleteAttendance(Guid id)
//    {
//        var adminId = GetAdminId();
//        _admin.SoftDelete(id, adminId);
//        return Ok(new { message = "Attendance deleted" });
//    }


//    //DELETE MULTIPLE ATTENDANCE
//    [HttpPost("attendance/bulk-delete")]
//    public IActionResult BulkDeleteAttendance([FromBody] Guid[] ids)
//    {
//        var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
//        var adminName = User.FindFirst("name")!.Value;
//        _admin.BulkDelete(ids, adminId);

//        foreach (var id in ids)
//        {
//            _audit.Log(
//                adminId,
//                adminName,
//                "BULK_DELETE",
//                "AttendanceLogs",
//                id,
//                "Attendance record deleted in bulk operation"
//            );
//        }



//        return Ok(new { message = "Attendance records deleted" });
//    }

//    //AUDIT LOGS
//    [HttpGet("audit")]
//    public IActionResult GetAuditLogs()
//    {
//        return Ok(_admin.GetAuditLogs());
//    }

//}
