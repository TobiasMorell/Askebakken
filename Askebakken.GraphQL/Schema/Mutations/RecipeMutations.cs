using Askebakken.GraphQL.Repository.Recipe;
using Askebakken.GraphQL.Schema.Inputs;
using HotChocolate.Authorization;

namespace Askebakken.GraphQL.Schema.Mutations;

[ExtendObjectType("Mutation")]
public class RecipeMutations
{
    [Authorize]
    public async Task<Recipe> CreateRecipe([Service] IRecipeRepository repo, CreateRecipeInput createRecipe, CancellationToken cancellationToken = default)
    {
        var actual = await repo.CreateRecipeAsync(createRecipe, cancellationToken);
        return actual;
    }
}