namespace Askebakken.GraphQL.Schema.Errors;

public class AlreadyParticipatingError : Exception
{
    public Guid MenuPlanId { get; }
    
    public AlreadyParticipatingError(Guid menuPlanId)
    {
        MenuPlanId = menuPlanId;
    }
}
