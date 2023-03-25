namespace Askebakken.GraphQL.Schema.Errors;

public class NotFoundError : Exception
{
    public IEnumerable<Guid> Ids { get; }
    
    public NotFoundError(string entityName, params Guid[] ids) : this($"The {entityName} with ids ({string.Join(", ", ids)}) was not found.")
    {
        Ids = ids;
    }
    
    public NotFoundError(string entityName, IEnumerable<Guid> ids) : this(entityName, ids.ToArray()) {}

    private NotFoundError(string message) : base(message)
    {
    }
}