using System.Security.Claims;
using Askebakken.GraphQL.Schema.Errors;
using Askebakken.GraphQL.Services;
using HotChocolate.Authorization;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Schema.Mutations;

public class MenuPlanMutationType
{
    public ICollection<Guid> Recipes { get; set; }
    public DateTime Date { get; set; }
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

        var startOfRecipeDate = menuPlan.Date.Date;
        var endOfRecipeDate = menuPlan.Date.Date.AddDays(1);
        var existingMenuPlan = await collection.FindAsync(mp => mp.Date >= startOfRecipeDate && mp.Date < endOfRecipeDate);
        if (await existingMenuPlan.AnyAsync())
        {
            throw new MenuPlanAlreadyExistsErrors(menuPlan.Date);
        } 
        
        var actual = new MenuPlan()
        {
            Id = Guid.NewGuid(),
            RecipeIds = recipeIds,
            ParticipantIds = Array.Empty<Guid>(),
            Date = menuPlan.Date.Date,
            CreatedAt = DateTime.UtcNow,
            ModifiedAt = DateTime.UtcNow
        };
        await collection.InsertOneAsync(actual);
        return actual;
    }

    [Error<NotFoundError>]
    [Error<AlreadyParticipatingError>]
    [Authorize]
    public async Task<MenuPlan> Attend([Service] IMongoCollection<MenuPlan> collection, [Service] IUserService userService, Guid menuPlanId)
    {
        
        var menuPlan = await (await collection.FindAsync(mp => mp.Id == menuPlanId)).FirstOrDefaultAsync();
        if (menuPlan is null)
        {
            throw new NotFoundError(nameof(MenuPlan), menuPlanId);
        }

        var currentUser = await userService.GetAuthenticatedUser();
        var participantIds = menuPlan.ParticipantIds.ToHashSet();
        if (participantIds.Contains(currentUser.Id))
        {
            throw new AlreadyParticipatingError(menuPlanId);
        }
        
        participantIds.Add(currentUser.Id);
        menuPlan.ParticipantIds = participantIds;
        await collection.ReplaceOneAsync(mp => mp.Id == menuPlanId, menuPlan);
        return menuPlan;
    }
    
    [Error<NotFoundError>]
    [Error<NotParticipatingError>]
    [Authorize]
    public async Task<MenuPlan> Unattend([Service] IMongoCollection<MenuPlan> collection, [Service] IUserService userService, Guid menuPlanId)
    {
        var menuPlan = await (await collection.FindAsync(mp => mp.Id == menuPlanId)).FirstOrDefaultAsync();
        if (menuPlan is null)
        {
            throw new NotFoundError(nameof(MenuPlan), menuPlanId);
        }

        var currentUser = await userService.GetAuthenticatedUser();
        var participantIds = menuPlan.ParticipantIds.ToHashSet();
        if (!participantIds.Contains(currentUser.Id))
        {
            throw new NotParticipatingError(menuPlanId);
        }
        
        participantIds.Remove(currentUser.Id);
        menuPlan.ParticipantIds = participantIds;
        await collection.ReplaceOneAsync(mp => mp.Id == menuPlanId, menuPlan);
        return menuPlan;
    }
}