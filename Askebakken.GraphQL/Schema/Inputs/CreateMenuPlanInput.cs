namespace Askebakken.GraphQL.Schema.Mutations;

public class CreateMenuPlanInput
{
    public ICollection<Guid> Recipes { get; set; }
    public DateTime Date { get; set; }
}