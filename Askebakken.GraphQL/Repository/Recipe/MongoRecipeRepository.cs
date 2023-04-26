using Askebakken.GraphQL.Schema.Inputs;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Repository.Recipe;

public class MongoRecipeRepository : IRecipeRepository
{
    private readonly IMongoCollection<Schema.Recipe> _collection;

    public MongoRecipeRepository(IMongoCollection<Schema.Recipe> collection)
    {
        _collection = collection;
    }


    public async Task<Schema.Recipe> CreateRecipeAsync(CreateRecipeInput input, CancellationToken cancellationToken = default)
    {
        var actual = CreateRecipeFromInput(input);
        await _collection.InsertOneAsync(actual, cancellationToken: cancellationToken);
        return actual;
    }

    public async Task<Schema.Recipe[]> BulkCreateRecipeAsync(IEnumerable<CreateRecipeInput> input, CancellationToken cancellationToken = default)
    {
        var recipes = input.Select(CreateRecipeFromInput).ToArray();
        foreach (var recipe in recipes)
        {
            await _collection.InsertOneAsync(recipe, cancellationToken: cancellationToken);
        }
        return recipes;
    }
    
    public async Task<IEnumerable<Schema.Recipe>> GetRecipesAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken = default)
    {
        var recipeIds = ids.ToHashSet();
        var recipeCursor =
            await _collection.FindAsync(r => recipeIds.Contains(r.Id), cancellationToken: cancellationToken);
        return await recipeCursor.ToListAsync(cancellationToken: cancellationToken);
    }

    private static Schema.Recipe CreateRecipeFromInput(CreateRecipeInput createRecipe)
    {
        return new()
        {
            Name = createRecipe.Name,
            Category = createRecipe.Category,
            CreatedAt = DateTime.UtcNow,
            ModifiedAt = DateTime.UtcNow
        };
    }
}