namespace Askebakken.GraphQL.Schema;

public class Recipe : SchemaBase
{
    public required string Name { get; set; }
    public required string Category { get; set; }
}