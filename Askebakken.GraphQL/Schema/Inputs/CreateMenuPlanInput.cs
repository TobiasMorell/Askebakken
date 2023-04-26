namespace Askebakken.GraphQL.Schema.Inputs;

public class CreateMenuPlanInput
{
    public ICollection<Guid> Recipes { get; set; }
    public DateTime Date { get; set; }
}