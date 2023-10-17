using Askebakken.GraphQL.Repository.Recipe;
using Askebakken.GraphQL.Schema;
using Askebakken.GraphQL.Schema.Inputs;

namespace Askebakken.GraphQL.Tests.Fakes;

public class FakeRecipeRepo : FakeRepositoryBase<Recipe>, IRecipeRepository
{
    public Task<Recipe> CreateRecipeAsync(CreateRecipeInput input, CancellationToken cancellationToken = default)
    {
        var recipe = new Recipe()
        {
            CreatedAt = DateTime.UtcNow,
            ModifiedAt = DateTime.UtcNow,
            Name = input.Name,
            Category = input.Category,
            Id = Guid.NewGuid(),
        };
        
        MockData.Add(recipe);
        return Task.FromResult(recipe);
    }

    public async Task<Recipe[]> BulkCreateRecipeAsync(IEnumerable<CreateRecipeInput> input, CancellationToken cancellationToken = default)
    {
        var recipes = new List<Recipe>();
        foreach (var recipeInput in input)
        {
            recipes.Add(await CreateRecipeAsync(recipeInput, cancellationToken));
        }

        return recipes.ToArray();
    }

    public Task<IEnumerable<Recipe>> GetRecipesAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken = default)
    {
        var recipes = ids.Select(id => MockData.Find(r => r.Id == id)).Where(r => r is not null);
        return Task.FromResult(recipes.Cast<Recipe>());
    }
}