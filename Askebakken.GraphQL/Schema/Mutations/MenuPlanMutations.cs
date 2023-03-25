using System.Security.Claims;
using Askebakken.GraphQL.Schema.Errors;
using HotChocolate.Authorization;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Schema.Mutations;

public class MenuPlanMutationType
{
    public ICollection<Guid> Recipes { get; set; }
    public DateOnly Date { get; set; }
}

[ExtendObjectType("Mutation")]
public class MenuPlanMutations
{
    [Error<NotFoundError>]
    [Error<MenuPlanAlreadyExistsErrors>]
    [Authorize]
    public async Task<MenuPlan> CreateMenuPlan([Service] IMongoCollection<MenuPlan> collection, [Service] IMongoCollection<Recipe> recipeCollection, MenuPlanMutationType menuPlan)
    {
        var recipeIds = menuPlan.Recipes.ToHashSet();
        var recipeCursor = await recipeCollection.FindAsync(r => recipeIds.Contains(r.Id));
        var recipes = await recipeCursor.ToListAsync();
        var foundRecipeIds = recipes.Select(r => r.Id).ToHashSet();

        var missingRecipeIds = recipeIds.Where(r => !foundRecipeIds.Contains(r));
        if (missingRecipeIds.Any())
        {
            throw new NotFoundError(nameof(Recipe), missingRecipeIds);
        }

        var existingMenuPlan = await collection.FindAsync(mp => mp.Date == menuPlan.Date);
        if (await existingMenuPlan.AnyAsync())
        {
            throw new MenuPlanAlreadyExistsErrors(menuPlan.Date);
        } 
        
        var actual = new MenuPlan()
        {
            Id = Guid.NewGuid(),
            RecipeIds = recipeIds,
            ParticipantIds = Array.Empty<Guid>(),
            Date = menuPlan.Date,
            CreatedAt = DateTime.UtcNow,
            ModifiedAt = DateTime.UtcNow
        };
        await collection.InsertOneAsync(actual);
        return actual;
    }

    [Error<NotFoundError>]
    [Authorize]
    public async Task<MenuPlan> Attend([Service] IMongoCollection<MenuPlan> collection, ClaimsPrincipal claims, Guid menuPlanId)
    {
        
        var menuPlan = await (await collection.FindAsync(mp => mp.Id == menuPlanId)).FirstOrDefaultAsync();
        if (menuPlan is null)
        {
            throw new NotFoundError(nameof(MenuPlan), menuPlanId);
        }
        
        var participantIds = menuPlan.ParticipantIds.ToHashSet();
        throw new NotImplementedException();
    }
}