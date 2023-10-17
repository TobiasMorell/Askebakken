namespace Askebakken.GraphQL.Schema.Inputs;

public class CreateMenuPlanInput
{
    public string? Thumbnail { get; set; }
    public ICollection<Guid> Recipes { get; set; } = Array.Empty<Guid>();
    public DateTime Date { get; set; }
}