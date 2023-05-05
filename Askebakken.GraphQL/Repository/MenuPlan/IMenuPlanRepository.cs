namespace Askebakken.GraphQL.Repository.MenuPlan;

public interface IMenuPlanRepository
{
    Task<Schema.MenuPlan?> GetMenuPlanById(Guid id, CancellationToken cancellationToken = default);
    Task<Schema.MenuPlan?> GetMenuPlanByDate(DateTime date, CancellationToken cancellationToken = default);
    /// <summary>
    /// Gets all <see cref="MenuPlan"/>s between the two dates, inclusive.
    /// </summary>
    /// <param name="fromDate">Inclusive from date.</param>
    /// <param name="toDate">Inclusive to date.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>A read-only list of menu plans in the span.</returns>
    Task<IReadOnlyList<Schema.MenuPlan>> GetMenuPlansBetween(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default);
    
    Task CreateMenuPlan(Schema.MenuPlan menuPlan, CancellationToken cancellationToken = default);
    Task Delete(IEnumerable<Guid> ids, CancellationToken cancellationToken = default);
    Task<Schema.MenuPlan> Update(Schema.MenuPlan menuPlan, CancellationToken cancellationToken = default);
}