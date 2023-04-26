using Askebakken.GraphQL.Schema.Inputs;

namespace Askebakken.GraphQL.Repository.Recipe;

public interface IRecipeRepository
{
    Task<Schema.Recipe> CreateRecipeAsync(CreateRecipeInput input, CancellationToken cancellationToken = default);
    Task<Schema.Recipe[]> BulkCreateRecipeAsync(IEnumerable<CreateRecipeInput> input, CancellationToken cancellationToken = default);

    Task<IEnumerable<Schema.Recipe>> GetRecipesAsync(IEnumerable<Guid> ids,
        CancellationToken cancellationToken = default);
}