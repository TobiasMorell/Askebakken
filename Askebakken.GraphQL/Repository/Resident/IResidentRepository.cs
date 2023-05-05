namespace Askebakken.GraphQL.Repository.Resident;

public interface IResidentRepository
{
    Task<Schema.Resident?> GetResidentById(Guid id, CancellationToken cancellationToken = default);
    Task<Schema.Resident> Update(Schema.Resident resident, CancellationToken cancellationToken = default);
}