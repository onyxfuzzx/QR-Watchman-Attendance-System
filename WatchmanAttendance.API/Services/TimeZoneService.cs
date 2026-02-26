namespace WatchmanAttendance.API.Services;

public class TimeZoneService
{
    private static readonly TimeZoneInfo AppTimeZone = ResolveTimeZone();

    public DateTime UtcNow => DateTime.UtcNow;

    public DateTime LocalNow => TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, AppTimeZone);

    public DateTime LocalToday => LocalNow.Date;

    public DateTime ToUtc(DateTime localDateTime)
    {
        if (localDateTime.Kind == DateTimeKind.Utc)
        {
            return localDateTime;
        }

        return TimeZoneInfo.ConvertTimeToUtc(DateTime.SpecifyKind(localDateTime, DateTimeKind.Unspecified), AppTimeZone);
    }

    public DateTime ToLocal(DateTime utcDateTime)
    {
        if (utcDateTime.Kind != DateTimeKind.Utc)
        {
            utcDateTime = DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc);
        }

        return TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, AppTimeZone);
    }

    public DateTime NormalizeToLocalDate(DateTime input)
    {
        if (input.Kind == DateTimeKind.Utc)
        {
            return ToLocal(input).Date;
        }

        if (input.Kind == DateTimeKind.Local)
        {
            return TimeZoneInfo.ConvertTime(input, AppTimeZone).Date;
        }

        return input.Date;
    }

    public (DateTime startUtc, DateTime endUtc) GetMonthRangeUtc()
    {
        var localNow = LocalNow;
        var localStart = new DateTime(localNow.Year, localNow.Month, 1);
        var localEnd = localStart.AddMonths(1);
        return (ToUtc(localStart), ToUtc(localEnd));
    }

    public (DateTime startLocal, DateTime endLocal) GetMonthRangeLocal()
    {
        var localNow = LocalNow;
        var localStart = new DateTime(localNow.Year, localNow.Month, 1);
        var localEnd = localStart.AddMonths(1);
        return (localStart, localEnd);
    }

    private static TimeZoneInfo ResolveTimeZone()
    {
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
        }
        catch (TimeZoneNotFoundException)
        {
            try
            {
                return TimeZoneInfo.FindSystemTimeZoneById("Asia/Kolkata");
            }
            catch
            {
                return TimeZoneInfo.Utc;
            }
        }
        catch (InvalidTimeZoneException)
        {
            return TimeZoneInfo.Utc;
        }
    }
}