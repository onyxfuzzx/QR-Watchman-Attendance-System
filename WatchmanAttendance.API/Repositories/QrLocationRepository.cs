using Dapper;
using WatchmanAttendance.API.Models;
using WatchmanAttendance.API.Services;

namespace WatchmanAttendance.API.Repositories;

public class QrLocationRepository
{
    private readonly DbConnectionFactory _db;

    public QrLocationRepository(DbConnectionFactory db)
    {
        _db = db;
    }

    // ADMIN: create QR location
    public void Create(QrLocation qr)
    {
        using var con = _db.Create();
        con.Execute("""
        INSERT INTO QrLocations
        (Id, LocationName, Latitude, Longitude, AllowedRadiusMeters, QrToken, IsActive, CreatedAt)
        VALUES
        (@Id, @LocationName, @Latitude, @Longitude, @AllowedRadiusMeters, @QrToken, 1, DATEADD(MINUTE, 330, GETUTCDATE()))
    """, qr);
    }

    public void Disable(Guid id)
    {
        using var con = _db.Create();
        con.Execute(
            "UPDATE QrLocations SET IsActive = 0 WHERE Id = @id",
            new { id }
        );
    }


    // WATCHMAN: validate QR via token
    public QrLocation? GetByToken(string token)
    {
        using var con = _db.Create();
        return con.QuerySingleOrDefault<QrLocation>(
            """
            SELECT *
            FROM QrLocations
            WHERE QrToken = @token AND IsActive = 1
            """,
            new { token }
        );
    }

    // ADMIN: list all active locations
    public IEnumerable<QrLocation> GetAll()
    {
        using var con = _db.Create();
        return con.Query<QrLocation>(
            "SELECT * FROM QrLocations WHERE IsActive = 1"
        );
    }

    //  REQUIRED FOR ATTENDANCE SECURITY
    public QrLocation? GetById(Guid id)
    {
        using var con = _db.Create();
        return con.QuerySingleOrDefault<QrLocation>(
            """
            SELECT *
            FROM QrLocations
            WHERE Id = @id AND IsActive = 1
            """,
            new { id }
        );
    }
}
