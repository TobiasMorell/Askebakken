namespace Askebakken.GraphQL.Schema.Inputs;

public class CreateMenuPlanInput
{
    public ICollection<Guid> Recipes { get; set; } = Array.Empty<Guid>();
    public DateTime Date { get; set; }
}