namespace Askebakken.GraphQL.Schema.Subscriptions.EventMessages;

public record MenuPlanUpdatedEventMessage(MenuPlan UpdatedMenuPlan)
{
    public const string Topic = "MenuPlanUpdatedEvent";
}