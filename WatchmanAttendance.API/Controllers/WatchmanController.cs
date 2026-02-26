using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WatchmanAttendance.API.Repositories;

[Authorize(Roles = "Watchman")]
[ApiController]
[Route("api/watchman")]
public class WatchmanController : ControllerBase
{
    private readonly WatchmanDashboardRepository _repo;

    public WatchmanController(WatchmanDashboardRepository repo)
    {
        _repo = repo;
    }

    [HttpGet("dashboard")]
    public IActionResult Dashboard()
    {
        var watchmanId = Guid.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var data = _repo.GetDashboard(watchmanId);
        return Ok(data);
    }
    
    [HttpGet("dashboard/chart")]
    public IActionResult Chart()
    {
        var watchmanId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var chart = _repo.GetAttendanceChart(watchmanId);

        return Ok(chart);
    }


}
