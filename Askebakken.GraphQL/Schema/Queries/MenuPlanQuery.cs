using HotChocolate.Data;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Schema.Queries;

[ExtendObjectType("Query")]
public class MenuPlanQuery
{
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IExecutable<MenuPlan> GetMenuPlan([Service] IMongoCollection<MenuPlan> collection)
    {
        return collection.AsExecutable();
    }

    [UseFirstOrDefault]
    public IExecutable<MenuPlan> GetMenuPlanById(
        [Service] IMongoCollection<MenuPlan> collection,
        Guid id)
    {
        return collection.Find(x => x.Id == id).AsExecutable();
    }
}