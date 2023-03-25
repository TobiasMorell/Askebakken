using HotChocolate.Authorization;
using HotChocolate.Data;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Schema.Queries;

[ExtendObjectType("Query")]
public class WeekPlanQuery
{
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IExecutable<WeekPlan> GetWeekPlan([Service] IMongoCollection<WeekPlan> collection)
    {
        return collection.AsExecutable();
    }

    [Authorize]
    [UseFirstOrDefault]
    public IExecutable<WeekPlan> GetWeekPlanById(
        [Service] IMongoCollection<WeekPlan> collection,
        Guid id)
    {
        return collection.Find(x => x.Id == id).AsExecutable();
    }
}