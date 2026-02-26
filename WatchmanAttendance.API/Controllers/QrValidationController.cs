using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchmanAttendance.API.DTOs;
using WatchmanAttendance.API.Repositories;

namespace WatchmanAttendance.API.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/qr")]
public class QrValidationController : ControllerBase
{
    private readonly QrLocationRepository _repo;

    public QrValidationController(QrLocationRepository repo)
    {
        _repo = repo;
    }

    [HttpPost("validate")]
    public IActionResult Validate(ValidateQrRequest req)
    {
        var qr = _repo.GetByToken(req.QrToken);
        if (qr == null)
            return Unauthorized("Invalid or inactive QR");

        return Ok(new
        {
            locationId = qr.Id,
            locationName = qr.LocationName,
            qr.Latitude,
            qr.Longitude
        });

    }
}
