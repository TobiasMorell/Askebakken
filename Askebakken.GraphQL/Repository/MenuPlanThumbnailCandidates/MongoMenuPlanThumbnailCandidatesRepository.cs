using MongoDB.Driver;

namespace Askebakken.GraphQL.Repository.MenuPlanThumbnailCandidates;

public class MongoMenuPlanThumbnailCandidatesRepository : IMenuPlanThumbnailCandidatesRepository
{
    private readonly IMongoCollection<Schema.MenuPlanThumbnailCandidates> _collection;

    public MongoMenuPlanThumbnailCandidatesRepository(IMongoCollection<Schema.MenuPlanThumbnailCandidates> collection)
    {
        _collection = collection;
    }

    public async Task<Schema.MenuPlanThumbnailCandidates?> GetMenuPlanThumbnailCandidatesAsync(Guid menuPlanId, CancellationToken cancellationToken = default)
    {
        var cursor = await _collection.FindAsync(mptc => mptc.MenuPlanId == menuPlanId, cancellationToken: cancellationToken);
        return await cursor.FirstOrDefaultAsync(cancellationToken: cancellationToken);
    }

    public async Task<Schema.MenuPlanThumbnailCandidates> CreateMenuPlanThumbnailCandidatesAsync(Schema.MenuPlanThumbnailCandidates input,
        CancellationToken cancellationToken = default)
    {
        if (input.Id == Guid.Empty)
        {
            input.Id = Guid.NewGuid();
        }
        
        input.CreatedAt = DateTime.UtcNow;
        input.ModifiedAt = DateTime.UtcNow;
        
        await _collection.InsertOneAsync(input, cancellationToken: cancellationToken);
        return input;
    }
}