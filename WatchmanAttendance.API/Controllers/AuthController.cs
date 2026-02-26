using Microsoft.AspNetCore.Mvc;
using WatchmanAttendance.API.DTOs;
using WatchmanAttendance.API.Services;
using WatchmanAttendance.API.Repositories;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly WatchmanRepository _watchmanRepo;
    private readonly AdminAuthRepository _adminRepo;
    private readonly JwtService _jwt;

    public AuthController(
        WatchmanRepository watchmanRepo,
        AdminAuthRepository adminRepo,
        JwtService jwt)
    {
        _watchmanRepo = watchmanRepo;
        _adminRepo = adminRepo;
        _jwt = jwt;
    }


    // WATCHMAN LOGIN
    [HttpPost("watchman/login")]
    public IActionResult WatchmanLogin(LoginRequest req)
    {
        var user = _watchmanRepo.GetByUsername(req.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials");

        var token = _jwt.Generate(user.Id, "Watchman", user.FullName);
        return Ok(new { token });
    }


    [HttpPost("login")]
    public IActionResult Login(LoginRequest req)
    {
        // 1️⃣ Check Admin first
        var admin = _adminRepo.GetByUsername(req.Username);
        if (admin != null && BCrypt.Net.BCrypt.Verify(req.Password, admin.PasswordHash))
        {
            var adminToken = _jwt.Generate(admin.Id, "Admin", admin.Username);
            return Ok(new { token = adminToken });
        }

        // 2️⃣ Check Watchman
        var watchman = _watchmanRepo.GetByUsername(req.Username);
        if (watchman != null && BCrypt.Net.BCrypt.Verify(req.Password, watchman.PasswordHash))
        {
            var watchmanToken = _jwt.Generate(watchman.Id, "Watchman", watchman.FullName);
            return Ok(new { token = watchmanToken });
        }

        // 3️⃣ Invalid credentials
        return Unauthorized("Invalid username or password");
    }



    // ADMIN LOGIN
    [HttpPost("admin/login")]
    public IActionResult AdminLogin(LoginRequest req)
    {
        var admin = _adminRepo.GetByUsername(req.Username);
        if (admin == null || !BCrypt.Net.BCrypt.Verify(req.Password, admin.PasswordHash))
            return Unauthorized("Invalid credentials");

        var token = _jwt.Generate(admin.Id, "Admin", admin.Username);
        return Ok(new { token });
    }
}
