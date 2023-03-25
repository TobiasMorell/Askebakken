using HotChocolate.Authorization;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Schema.Mutations;

public class RecipeMutationType
{
    public Guid? Id { get; set; }
    public string Name { get; set; }
}

[ExtendObjectType("Mutation")]
public class RecipeMutations
{
    [Authorize]
    public async Task<Recipe> CreateRecipe([Service] IMongoCollection<Recipe> collection, RecipeMutationType recipe)
    {
        var actual = new Recipe()
        {
            Id = recipe.Id ?? Guid.NewGuid(),
            Name = recipe.Name,
            CreatedAt = DateTime.UtcNow,
            ModifiedAt = DateTime.UtcNow
        };
        await collection.InsertOneAsync(actual);
        return actual;
    }
}