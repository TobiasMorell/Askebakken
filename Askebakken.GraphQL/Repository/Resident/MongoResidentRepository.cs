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