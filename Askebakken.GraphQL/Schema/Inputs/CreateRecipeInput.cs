namespace Askebakken.GraphQL.Schema.Inputs;

public class CreateRecipeInput
{
    public required string Name { get; set; }
    public required string Category { get; set; }
    public string? Thumbnail { get; set; }
}