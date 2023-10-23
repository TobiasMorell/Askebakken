using Askebakken.GraphQL.Schema.Subscriptions.EventMessages;
using HotChocolate.Authorization;

namespace Askebakken.GraphQL.Schema.Subscriptions;

public class Subscriptions
{
    [Subscribe]
    [Topic(MenuPlanUpdatedEventMessage.Topic)]
    public MenuPlanUpdatedEventMessage MenuPlanUpdated(
        [EventMessage] MenuPlanUpdatedEventMessage message) =>
        message;
}