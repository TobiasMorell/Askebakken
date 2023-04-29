namespace Askebakken.GraphQL.Schema.Subscriptions;

public record AttendanceChangedEventMessage(Guid MenuPlanId, Guid ResidentId, bool Attending)
{
    public const string Topic = "MenuPlanAttendanceChanged";
}

public class Subscriptions
{
    [Subscribe]
    [Topic(AttendanceChangedEventMessage.Topic)]
    public AttendanceChangedEventMessage MenuPlanAttendanceChanged(
        [EventMessage] AttendanceChangedEventMessage message) =>
        message;
}