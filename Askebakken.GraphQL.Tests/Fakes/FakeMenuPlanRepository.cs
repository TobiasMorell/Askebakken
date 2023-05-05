using Askebakken.GraphQL.Repository.MenuPlan;
using Askebakken.GraphQL.Schema;

namespace Askebakken.GraphQL.Tests.Fakes;

public class FakeMenuPlanRepository : FakeRepositoryBase<MenuPlan>, IMenuPlanRepository
{
    private readonly List<MenuPlan> _createdMenuPlans = new();
    public IReadOnlyList<MenuPlan> CreatedMenuPlans => _createdMenuPlans;
    
    private readonly List<MenuPlan> _updatedMenuPlans = new();
    public IReadOnlyList<MenuPlan> UpdatedMenuPlans => _updatedMenuPlans;

    public Task<MenuPlan?> GetMenuPlanById(Guid id, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(MockData.FirstOrDefault(r => r.Id == id));
    }

    public Task<MenuPlan?> GetMenuPlanByDate(DateTime date, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(MockData.FirstOrDefault(r => r.Date == date));
    }

    public Task<IReadOnlyList<MenuPlan>> GetMenuPlansBetween(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(MockData.Where(r => r.Date >= fromDate && r.Date <= toDate).ToList() as IReadOnlyList<MenuPlan>);
    }

    public Task CreateMenuPlan(MenuPlan menuPlan, CancellationToken cancellationToken = default)
    {
        if (menuPlan.Id == Guid.Empty)
        {
            menuPlan.Id = Guid.NewGuid();
        }
        menuPlan.CreatedAt = DateTime.UtcNow;
        menuPlan.ModifiedAt = DateTime.UtcNow;
        
        // Strip time-component of date
        menuPlan.Date = menuPlan.Date.Date;
        
        _createdMenuPlans.Add(menuPlan);
        return Task.CompletedTask;
    }

    public Task Delete(IEnumerable<Guid> ids, CancellationToken cancellationToken = default)
    {
        var existingMenuPlanIds = ids.ToHashSet();
        MockData.RemoveAll(mp => existingMenuPlanIds.Contains(mp.Id));
        return Task.CompletedTask;
    }

    public Task<MenuPlan> Update(MenuPlan menuPlan, CancellationToken cancellationToken = default)
    {
        if (menuPlan.Id == Guid.Empty)
        {
            throw new InvalidOperationException("Cannot update a menu plan without an id");
        }

        _updatedMenuPlans.Add(menuPlan);
        return Task.FromResult(menuPlan);
    }
}