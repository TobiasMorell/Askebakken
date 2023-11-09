namespace Askebakken.GraphQL.Extensions;

public static class DateTimeExtensions
{
    /// <summary>
    /// Gets the next occurence of the given day of week, or today if today is that day.
    /// </summary>
    /// <param name="from">The date to get the next occurence from.</param>
    /// <param name="dayOfWeek">The day of week to find.</param>
    /// <returns>The next occurence of the given <paramref name="dayOfWeek"/>.</returns>
    public static DateTime Next(this DateTime from, DayOfWeek dayOfWeek)
    {
        var daysUntilTuesday = ((int) dayOfWeek - (int) from.DayOfWeek + 7) % 7;
        return from.AddDays(daysUntilTuesday);
    }
}