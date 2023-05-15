namespace Askebakken.GraphQL.Repository.Resident;

public interface IResidentRepository
{
    Task<Schema.Resident?> GetResidentById(Guid id, CancellationToken cancellationToken = default);
    Task<Schema.Resident?> GetResidentByUsername(string username, CancellationToken cancellationToken = default);
    Task<IEnumerable<Schema.Resident>> GetResidentsByHouse(string houseNumber, CancellationToken cancellationToken = default);
    Task<Schema.Resident> Create(Schema.Resident resident, CancellationToken cancellationToken = default);
    Task<Schema.Resident> Update(Schema.Resident resident, CancellationToken cancellationToken = default);
}