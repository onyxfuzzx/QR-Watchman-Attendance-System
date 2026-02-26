using Dapper;
using WatchmanAttendance.API.Models;
using WatchmanAttendance.API.Services;

namespace WatchmanAttendance.API.Repositories
{
    public class WatchmanRepository
    {
        private readonly DbConnectionFactory _db;
        public WatchmanRepository(DbConnectionFactory db)
            => _db = db;

        public Watchman? GetByUsername(string username)
        {
            using var con = _db.Create();
            return con.QuerySingleOrDefault<Watchman>(
                "SELECT * FROM Watchmen WHERE Username=@u AND IsActive=1",
                new { u = username }
            );
        }

        public IEnumerable<Watchman> GetAllWatchmen()
        {
            using var con = _db.Create();
            return con.Query<Watchman>("SELECT * FROM Watchmen");
        }

        public void SetWatchmanStatus(Guid id, bool status)
        {
            using var con = _db.Create();
            con.Execute(
                "UPDATE Watchmen SET IsActive=@s WHERE Id=@id",
                new { id, s = status }
            );
        }

        public void Create(Watchman w)
        {
            using var con = _db.Create();
            con.Execute("""
                INSERT INTO Watchmen (Id, FullName, Username, PasswordHash, IsActive)
                VALUES (@Id,@FullName,@Username,@PasswordHash,1)
            """, w);
        }
    }
}
