using Dapper;
using WatchmanAttendance.API.Models;
using WatchmanAttendance.API.Services;

namespace WatchmanAttendance.API.Repositories;

public class AdminAuthRepository
{
    private readonly DbConnectionFactory _db;
    public AdminAuthRepository(DbConnectionFactory db) => _db = db;

    public Admin? GetByUsername(string username)
    {
        using var con = _db.Create();
        return con.QuerySingleOrDefault<Admin>(
            "SELECT * FROM Admins WHERE Username=@u",
            new { u = username });
    }
}
    