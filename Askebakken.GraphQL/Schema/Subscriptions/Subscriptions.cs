using HotChocolate.Authorization;

namespace Askebakken.GraphQL.Schema.Subscriptions;

public class Subscriptions
{
    [Authorize]
    [Subscribe]
    [Topic(AttendanceChangedEventMessage.Topic)]
    public AttendanceChangedEventMessage MenuPlanAttendanceChanged(
        [EventMessage] AttendanceChangedEventMessage message) =>
        message;
}