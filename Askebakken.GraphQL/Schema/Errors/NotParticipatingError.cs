namespace Askebakken.GraphQL.Schema.Errors;

public class NotParticipatingError : Exception
{
    public Guid MenuPlanId { get; }

    public NotParticipatingError(Guid menuPlanId)
    {
        MenuPlanId = menuPlanId;
    }
}