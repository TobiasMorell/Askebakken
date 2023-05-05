namespace Askebakken.GraphQL.Schema.Subscriptions;

public record AttendanceChangedEventMessage(Guid MenuPlanId, Guid ResidentId, bool Attending)
{
    public const string Topic = "MenuPlanAttendanceChanged";
}