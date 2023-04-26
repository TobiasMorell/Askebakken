using System.Security.Claims;
using Askebakken.GraphQL.Repository.Recipe;
using Askebakken.GraphQL.Schema.Errors;
using Askebakken.GraphQL.Schema.Inputs;
using Askebakken.GraphQL.Services;
using HotChocolate.Authorization;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Schema.Mutations;

[ExtendObjectType("Mutation")]
public class MenuPlanMutations
{
    [Error<NotFoundError>]
    [Error<MenuPlanAlreadyExistsErrors>]
    [Authorize]
    public async Task<MenuPlan> CreateMenuPlan([Service] IMongoCollection<MenuPlan> collection,
        [Service] IRecipeRepository recipeRepo,
        CreateMenuPlanInput createMenuPlan,
        CancellationToken cancellationToken = default)
    {
        var recipes = await recipeRepo.GetRecipesAsync(createMenuPlan.Recipes, cancellationToken);
        var foundRecipeIds = recipes.Select(r => r.Id).ToHashSet();
        var missingRecipeIds = createMenuPlan.Recipes.Where(r => !foundRecipeIds.Contains(r));
        if (missingRecipeIds.Any())
        {
            throw new NotFoundError(nameof(Recipe), missingRecipeIds);
        }

        var startOfRecipeDate = createMenuPlan.Date.Date;
        var endOfRecipeDate = createMenuPlan.Date.Date.AddDays(1);
        var existingMenuPlan = await collection.FindAsync(
            mp => mp.Date >= startOfRecipeDate && mp.Date < endOfRecipeDate, cancellationToken: cancellationToken);
        if (await existingMenuPlan.AnyAsync(cancellationToken: cancellationToken))
        {
            throw new MenuPlanAlreadyExistsErrors(createMenuPlan.Date);
        }

        var actual = new MenuPlan()
        {
            Id = Guid.NewGuid(),
            RecipeIds = foundRecipeIds,
            ParticipantIds = Array.Empty<Guid>(),
            Date = createMenuPlan.Date.Date,
            CreatedAt = DateTime.UtcNow,
            ModifiedAt = DateTime.UtcNow
        };
        await collection.InsertOneAsync(actual, cancellationToken: cancellationToken);
        return actual;
    }

    [Error<NotFoundError>]
    [Error<MenuPlanAlreadyExistsErrors>]
    [Authorize]
    public async Task<IEnumerable<MenuPlan>> CreateWeekPlan([Service] IMongoCollection<MenuPlan> collection,
        [Service] IRecipeRepository recipeRepo,
        CreateWeekPlanInput createWeekPlan,
        CancellationToken cancellationToken = default)
    {
        var startOfRecipeDate = createWeekPlan.FromDate.Date;
        var endOfRecipeDate = startOfRecipeDate.AddDays(5);
        var existingMenuPlans =
            await (await collection.FindAsync(mp => mp.Date >= startOfRecipeDate && mp.Date < endOfRecipeDate,
                cancellationToken: cancellationToken)).ToListAsync(cancellationToken: cancellationToken);
        if (existingMenuPlans.Any())
        {
            var existingMenuPlanIds = existingMenuPlans.Select(mp => mp.Id).ToHashSet();
            await collection.DeleteManyAsync(mp => existingMenuPlanIds.Contains(mp.Id), cancellationToken: cancellationToken);
        }

        var weekRecipes = new[]
        {
            createWeekPlan.Monday, createWeekPlan.Tuesday, createWeekPlan.Wednesday, createWeekPlan.Thursday,
            createWeekPlan.Friday
        };
        var results = new List<MenuPlan>();
        for (int i = 0; i < 5; i++)
        {
            var date = createWeekPlan.FromDate.Date.AddDays(i);

            var recipes = await recipeRepo.BulkCreateRecipeAsync(weekRecipes[i], cancellationToken);

            var menuPlan = await CreateMenuPlan(collection, recipeRepo,
                new CreateMenuPlanInput() { Date = date, Recipes = recipes.Select(r => r.Id).ToArray() },
                cancellationToken);

            results.Add(menuPlan);
        }

        return results;
    }

    [Error<NotFoundError>]
    [Error<AlreadyParticipatingError>]
    [Authorize]
    public async Task<MenuPlan> Attend([Service] IMongoCollection<MenuPlan> collection,
        [Service] IMongoCollection<Resident> residentCollection,
        [Service] IUserService userService,
        MenuPlanAttendanceInput input,
        CancellationToken cancellationToken = default)
    {
        var menuPlanId = input.MenuPlanId;
        var menuPlan =
            await (await collection.FindAsync(mp => mp.Id == menuPlanId, cancellationToken: cancellationToken))
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);
        if (menuPlan is null)
        {
            throw new NotFoundError(nameof(MenuPlan), menuPlanId);
        }

        var residentToAttend = input.ResidentId ?? (await userService.GetAuthenticatedUser(cancellationToken))!.Id;
        var participantIds = menuPlan.ParticipantIds.ToHashSet();
        if (participantIds.Contains(residentToAttend))
        {
            throw new AlreadyParticipatingError(menuPlanId);
        }

        participantIds.Add(residentToAttend);
        menuPlan.ParticipantIds = participantIds;
        var replaceMenuPlan =
            collection.ReplaceOneAsync(mp => mp.Id == menuPlanId, menuPlan, cancellationToken: cancellationToken);

        var resident =
            await (await residentCollection.FindAsync(r => r.Id == residentToAttend,
                cancellationToken: cancellationToken)).FirstOrDefaultAsync(cancellationToken: cancellationToken);
        var updateResident = residentCollection.FindOneAndUpdateAsync(r => r.Id == residentToAttend,
            Builders<Resident>.Update.Set(r => r.ParticipatesInIds,
                resident.ParticipatesInIds.Append(menuPlanId).ToArray()), cancellationToken: cancellationToken);

        await Task.WhenAll(replaceMenuPlan, updateResident);

        return menuPlan;
    }

    [Error<NotFoundError>]
    [Error<NotParticipatingError>]
    [Authorize]
    public async Task<MenuPlan> Unattend([Service] IMongoCollection<MenuPlan> collection,
        [Service] IMongoCollection<Resident> residentCollection,
        [Service] IUserService userService,
        MenuPlanAttendanceInput input,
        CancellationToken cancellationToken = default)
    {
        var menuPlanId = input.MenuPlanId;
        var menuPlan =
            await (await collection.FindAsync(mp => mp.Id == menuPlanId, cancellationToken: cancellationToken))
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);
        if (menuPlan is null)
        {
            throw new NotFoundError(nameof(MenuPlan), menuPlanId);
        }

        var residentToAttend = input.ResidentId ?? (await userService.GetAuthenticatedUser(cancellationToken))!.Id;
        var participantIds = menuPlan.ParticipantIds.ToHashSet();
        if (!participantIds.Contains(residentToAttend))
        {
            throw new NotParticipatingError(menuPlanId);
        }

        participantIds.Remove(residentToAttend);
        menuPlan.ParticipantIds = participantIds;
        var replaceMenuPlan =
            collection.ReplaceOneAsync(mp => mp.Id == menuPlanId, menuPlan, cancellationToken: cancellationToken);

        var resident =
            await (await residentCollection.FindAsync(r => r.Id == residentToAttend,
                cancellationToken: cancellationToken)).FirstOrDefaultAsync(cancellationToken: cancellationToken);
        var updateResident = residentCollection.FindOneAndUpdateAsync(r => r.Id == residentToAttend,
            Builders<Resident>.Update.Set(r => r.ParticipatesInIds,
                resident.ParticipatesInIds.Where(p => p != menuPlanId).ToArray()),
            cancellationToken: cancellationToken);

        await Task.WhenAll(replaceMenuPlan, updateResident);

        return menuPlan;
    }
}