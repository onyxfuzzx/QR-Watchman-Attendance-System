using Dapper;
using WatchmanAttendance.API.Services;

public class AdminAuditRepository
{
    private readonly DbConnectionFactory _db;

    public AdminAuditRepository(DbConnectionFactory db)
    {
        _db = db;
    }

    public void Log(
        Guid adminId,
        string adminName,
        string action,
        string tableName,
        Guid? recordId,
        string description)
    {
        using var con = _db.Create();

        con.Execute("""
            INSERT INTO AdminAuditLogs
            (
                Id,
                AdminId,
                AdminName,
                Action,
                TableName,
                RecordId,
                Description,
                PerformedAt
            )
            VALUES
            (
                @Id,
                @AdminId,
                @AdminName,
                @Action,
                @TableName,
                @RecordId,
                @Description,
                DATEADD(MINUTE, 330, GETUTCDATE())
            )
        """, new
        {
            Id = Guid.NewGuid(),
            AdminId = adminId,
            AdminName = adminName,
            Action = action,
            TableName = tableName,
            RecordId = recordId,
            Description = description
        });
    }
}
