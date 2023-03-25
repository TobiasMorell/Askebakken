namespace Askebakken.GraphQL.Schema;

public abstract class SchemaBase
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ModifiedAt { get; set; }
}