using Askebakken.GraphQL.Repository.Resident;
using Askebakken.GraphQL.Schema;

namespace Askebakken.GraphQL.Tests.Fakes;

public class FakeResidentRepository : FakeRepositoryBase<Resident>, IResidentRepository
{
    private readonly List<Resident> _updatedResidents = new();
    public IReadOnlyList<Resident> UpdatedResidents => _updatedResidents;

    public Task<Resident?> GetResidentById(Guid id, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(MockData.FirstOrDefault(r => r.Id == id));
    }

    public Task<Resident> Update(Resident resident, CancellationToken cancellationToken = default)
    {
        if (resident.Id == Guid.Empty)
        {
            throw new ArgumentException("Resident must have an id", nameof(resident));
        }
        
        resident.ModifiedAt = DateTime.UtcNow;
        
        _updatedResidents.Add(resident);
        return Task.FromResult(resident);
    }
}