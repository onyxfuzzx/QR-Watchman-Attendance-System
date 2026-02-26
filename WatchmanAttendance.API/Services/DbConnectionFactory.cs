using Microsoft.Data.SqlClient;
using System.Data;

namespace WatchmanAttendance.API.Services;

public class DbConnectionFactory
{
    private readonly IConfiguration _config;
    public DbConnectionFactory(IConfiguration config) => _config = config;

    public IDbConnection Create()
        => new SqlConnection(_config.GetConnectionString("Default"));
}
