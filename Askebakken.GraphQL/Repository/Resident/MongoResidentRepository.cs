using MongoDB.Driver;

namespace Askebakken.GraphQL.Repository.Resident;

public class MongoResidentRepository : IResidentRepository
{
    private readonly IMongoCollection<Schema.Resident> _residents;

    public MongoResidentRepository(IMongoCollection<Schema.Resident> residents)
    {
        _residents = residents;
    }

    public async Task<Schema.Resident?> GetResidentById(Guid id, CancellationToken cancellationToken = default)
    {
        var cursor = await _residents.FindAsync(r => r.Id == id, cancellationToken: cancellationToken);
        return await cursor.FirstOrDefaultAsync(cancellationToken: cancellationToken);
    }

    public async Task<Schema.Resident?> GetResidentByUsername(string username, CancellationToken cancellationToken = default)
    {
        var cursor = await _residents.FindAsync(r => r.Username == username, cancellationToken: cancellationToken);
        return await cursor.FirstOrDefaultAsync(cancellationToken: cancellationToken);
    }

    public async Task<IEnumerable<Schema.Resident>> GetResidentsByHouse(string houseNumber, CancellationToken cancellationToken = default)
    {
        var houseNumberUpper = houseNumber.ToUpperInvariant();
        var cursor = await _residents.FindAsync(r => r.HouseNumber == houseNumberUpper, cancellationToken: cancellationToken);
        return await cursor.ToListAsync(cancellationToken: cancellationToken);
    }

    public async Task<Schema.Resident> Create(Schema.Resident resident, CancellationToken cancellationToken = default)
    {
        resident.CreatedAt = DateTime.UtcNow;
        resident.ModifiedAt = DateTime.UtcNow;

        if (resident.Id == Guid.Empty)
        {
            resident.Id = Guid.NewGuid();
        }

        await _residents.InsertOneAsync(resident, cancellationToken: cancellationToken);
        return resident;
    }

    public async Task<Schema.Resident> Update(Schema.Resident resident, CancellationToken cancellationToken = default)
    {
        if (resident.Id == Guid.Empty)
        {
            throw new ArgumentException("Resident must have an id", nameof(resident));
        }
        
        resident.ModifiedAt = DateTime.UtcNow;
        
        return await _residents.FindOneAndReplaceAsync(r => r.Id == resident.Id, resident, cancellationToken: cancellationToken);
    }
}