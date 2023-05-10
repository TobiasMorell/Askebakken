using MongoDB.Driver;

namespace Askebakken.GraphQL.Repository.MenuPlan;

public class MongoMenuPlanRepository : IMenuPlanRepository
{
    private readonly IMongoCollection<Schema.MenuPlan> _menuPlans;

    public MongoMenuPlanRepository(IMongoCollection<Schema.MenuPlan> menuPlans)
    {
        _menuPlans = menuPlans;
    }

    public async Task<Schema.MenuPlan?> GetMenuPlanById(Guid id, CancellationToken cancellationToken = default)
    {
        var cursor = await _menuPlans.FindAsync(mp => mp.Id == id, cancellationToken: cancellationToken);
        return await cursor.FirstOrDefaultAsync(cancellationToken: cancellationToken);
    }

    public async Task<Schema.MenuPlan?> GetMenuPlanByDate(DateTime date, CancellationToken cancellationToken = default)
    {
        var startOfRecipeDate = date.Date;
        var endOfRecipeDate = date.Date.AddDays(1);
        var cursor = await _menuPlans.FindAsync(mp => mp.Date >= startOfRecipeDate && mp.Date < endOfRecipeDate,
            cancellationToken: cancellationToken);
        return await cursor.FirstOrDefaultAsync(cancellationToken: cancellationToken);
    }

    public async Task<IReadOnlyList<Schema.MenuPlan>> GetMenuPlansBetween(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default)
    {
        var startOfRecipeDate = fromDate.Date;
        var endOfRecipeDate = toDate.AddDays(1);
        var cursor = await _menuPlans.FindAsync(mp => mp.Date >= startOfRecipeDate && mp.Date < endOfRecipeDate,
            cancellationToken: cancellationToken);
        return await cursor.ToListAsync(cancellationToken: cancellationToken);
    }

    public async Task CreateMenuPlan(Schema.MenuPlan menuPlan, CancellationToken cancellationToken = default)
    {
        if (menuPlan.Id == Guid.Empty)
        {
            menuPlan.Id = Guid.NewGuid();
        }
        menuPlan.CreatedAt = DateTime.UtcNow;
        menuPlan.ModifiedAt = DateTime.UtcNow;
        
        // Strip time-component of date
        menuPlan.Date = menuPlan.Date.Date;
        
        await _menuPlans.InsertOneAsync(menuPlan, cancellationToken: cancellationToken);
    }

    public async Task Delete(IEnumerable<Guid> ids, CancellationToken cancellationToken = default)
    {
        var existingMenuPlanIds = ids.ToHashSet();
        await _menuPlans.DeleteManyAsync(mp => existingMenuPlanIds.Contains(mp.Id), cancellationToken: cancellationToken);
    }

    public async Task<Schema.MenuPlan> Update(Schema.MenuPlan menuPlan, CancellationToken cancellationToken = default)
    {
        if (menuPlan.Id == Guid.Empty)
        {
            throw new InvalidOperationException("Cannot update a menu plan without an ID.");
        }
        
        menuPlan.ModifiedAt = DateTime.UtcNow;

        await _menuPlans.FindOneAndReplaceAsync(mp => mp.Id == menuPlan.Id,
            menuPlan,
            cancellationToken: cancellationToken);
        return menuPlan;
    }
}