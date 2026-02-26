using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchmanAttendance.API.DTOs;
using WatchmanAttendance.API.Models;
using WatchmanAttendance.API.Repositories;

namespace WatchmanAttendance.API.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/qr")]
public class QrController : ControllerBase
{
    private readonly QrLocationRepository _repo;
    private readonly IConfiguration _config;


    public QrController(QrLocationRepository repo, IConfiguration config)
    {
        _repo = repo;
        _config = config;   
    }

    // Create QR Location
    [HttpPost("create")]
    public IActionResult Create(CreateQrLocationRequest req)
    {
        var token = Guid.NewGuid().ToString("N");

        var qr = new QrLocation
        {
            Id = Guid.NewGuid(),
            LocationName = req.LocationName,
            Latitude = (decimal)req.Latitude,
            Longitude = (decimal)req.Longitude,
            AllowedRadiusMeters = req.Radius,
            QrToken = Guid.NewGuid().ToString("N"),
            IsActive = true
        };

        _repo.Create(qr);

        // This URL will be encoded into QR
        var frontendUrl = _config["Frontend:BaseUrl"];
        var qrUrl = $"{frontendUrl}/scan/{token}";

        return Ok(new
        {
            qr.LocationName,
            qr.Latitude,
            qr.Longitude,
            QrToken = token,
            QrUrl = qrUrl
        });
    }

    [HttpPost("disable/{id}")]
    public IActionResult Disable(Guid id)
    {
        _repo.Disable(id);
        return Ok(new { message = "QR disabled" });
    }


    // List QR Locations
    [HttpGet("list")]
    public IActionResult List()
    {
        return Ok(_repo.GetAll());
    }
}
    