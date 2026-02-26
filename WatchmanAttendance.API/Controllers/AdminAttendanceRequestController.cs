using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WatchmanAttendance.API.Models;
using WatchmanAttendance.API.Repositories;

namespace WatchmanAttendance.API.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/admin/attendance-request")]
public class AdminAttendanceRequestController : ControllerBase
{
    private readonly AttendanceRequestRepository _reqRepo;
    private readonly AttendanceRepository _attendanceRepo;
    private readonly AdminAuditRepository _audit;
    public AdminAttendanceRequestController(
        AttendanceRequestRepository reqRepo,
        AttendanceRepository attendanceRepo,
        AdminAuditRepository audit)
    {
        _reqRepo = reqRepo;
        _attendanceRepo = attendanceRepo;
        _audit = audit;
    }

    //  Admin sees pending requests
    [HttpGet]
    public IActionResult Pending()
    {
        return Ok(_reqRepo.GetPending());
    }

    //  Admin approves
    [HttpPost("{id}/approve")]
    public IActionResult Approve(Guid id)
    {
        var adminId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );
        var adminName = User.FindFirstValue("name")!;   

        //  Fetch request
        var req = _reqRepo.GetById(id);
        if (req == null)
            return NotFound("Request not found");

        //  Mark request approved
        _reqRepo.UpdateStatus(id, "Approved");
        _audit.Log(
        adminId,
        adminName,
        "APPROVE_ATTENDANCE",
        "AttendanceRequests",
        id,
        "Attendance request approved"
    );

        //  Check if attendance already exists
        if (!_attendanceRepo.HasAttendanceForDate(req.WatchmanId, req.AttendanceDate))
        {
            //  INSERT attendance
            _attendanceRepo.InsertApprovedAttendance(
                req.WatchmanId,
                req.AttendanceDate,
                req.Type == "HalfDay" ? "HalfDay" : "Present",
                adminId
            );
            _audit.Log(
        adminId,
        adminName,
        "APPROVE_ATTENDANCE",
        "AttendanceRequests",
        id,
        "Attendance request approved"
    );

        }

        else
        {
            //  UPDATE existing attendance
            _attendanceRepo.ApproveAttendanceByDate(
                req.WatchmanId,
                req.AttendanceDate,
                req.Type == "HalfDay" ? "HalfDay" : "Present",
                adminId
            );
        }

        return Ok(new { message = "Attendance approved" });

    }




    //  Admin rejects
    [HttpPost("{id}/reject")]
    public IActionResult Reject(Guid id)
    {
        var adminId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var adminName = User.FindFirstValue("name")!;

        _reqRepo.UpdateStatus(id, "Rejected");
        _audit.Log(
        adminId,
        adminName,
        "REJECT_ATTENDANCE",
        "AttendanceRequests",
        id,
        "Attendance request rejected"
    );
        return Ok(new { message = "Attendance rejected" });

    }
}
