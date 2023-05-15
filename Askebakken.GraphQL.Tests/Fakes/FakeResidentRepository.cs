using Askebakken.GraphQL.Repository.Resident;
using Askebakken.GraphQL.Schema;

namespace Askebakken.GraphQL.Tests.Fakes;

public class FakeResidentRepository : FakeRepositoryBase<Resident>, IResidentRepository
{
    private readonly List<Resident> _updatedResidents = new();
    public IReadOnlyList<Resident> UpdatedResidents => _updatedResidents;
    private readonly List<Resident> _createdResidents = new();
    public IReadOnlyList<Resident> CreatedResidents => _createdResidents;

    public Task<Resident?> GetResidentById(Guid id, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(MockData.FirstOrDefault(r => r.Id == id));
    }

    public Task<Resident?> GetResidentByUsername(string username, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(MockData.FirstOrDefault(r => r.Username == username));
    }

    public Task<IEnumerable<Resident>> GetResidentsByHouse(string houseNumber, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(MockData.Where(r => r.HouseNumber == houseNumber.ToUpperInvariant()));
    }

    public Task<Resident> Create(Resident resident, CancellationToken cancellationToken = default)
    {
        if (resident.Id == Guid.Empty)
        {
            resident.Id = Guid.NewGuid();
        }
        resident.CreatedAt = DateTime.UtcNow;
        resident.ModifiedAt = DateTime.UtcNow;
        
        _createdResidents.Add(resident);
        return Task.FromResult(resident);
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