using HotChocolate.Authorization;
using HotChocolate.Data;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Schema.Queries;

[ExtendObjectType("Query")]
public class RecipeQuery
{
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IExecutable<Recipe> GetRecipes([Service] IMongoCollection<Recipe> collection)
    {
        return collection.AsExecutable();
    }

    [Authorize]
    [UseFirstOrDefault]
    public IExecutable<Recipe> GetRecipeById(
        [Service] IMongoCollection<Recipe> collection,
        Guid id)
    {
        return collection.Find(x => x.Id == id).AsExecutable();
    }
}