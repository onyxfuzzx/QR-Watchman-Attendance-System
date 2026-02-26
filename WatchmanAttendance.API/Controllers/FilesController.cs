using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WatchmanAttendance.API.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/files")]
public class FilesController : ControllerBase
{
    [HttpGet("{fileName}")]
    public IActionResult Get(string fileName)
    {
        var path = Path.Combine("Uploads", fileName);
        if (!System.IO.File.Exists(path))
            return NotFound();

        var bytes = System.IO.File.ReadAllBytes(path);
        return File(bytes, "image/jpeg");
    }
}
    