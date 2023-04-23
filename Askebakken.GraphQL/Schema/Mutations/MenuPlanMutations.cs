using System.Security.Claims;
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
        [Service] IMongoCollection<Recipe> recipeCollection,
        CreateMenuPlanInput createMenuPlan)
    {
        var recipeIds = createMenuPlan.Recipes.ToHashSet();
        var recipeCursor = await recipeCollection.FindAsync(r => recipeIds.Contains(r.Id));
        var recipes = await recipeCursor.ToListAsync();
        var foundRecipeIds = recipes.Select(r => r.Id).ToHashSet();

        var missingRecipeIds = recipeIds.Where(r => !foundRecipeIds.Contains(r));
        if (missingRecipeIds.Any())
        {
            throw new NotFoundError(nameof(Recipe), missingRecipeIds);
        }

        var startOfRecipeDate = createMenuPlan.Date.Date;
        var endOfRecipeDate = createMenuPlan.Date.Date.AddDays(1);
        var existingMenuPlan =
            await collection.FindAsync(mp => mp.Date >= startOfRecipeDate && mp.Date < endOfRecipeDate);
        if (await existingMenuPlan.AnyAsync())
        {
            throw new MenuPlanAlreadyExistsErrors(createMenuPlan.Date);
        }

        var actual = new MenuPlan()
        {
            Id = Guid.NewGuid(),
            RecipeIds = recipeIds,
            ParticipantIds = Array.Empty<Guid>(),
            Date = createMenuPlan.Date.Date,
            CreatedAt = DateTime.UtcNow,
            ModifiedAt = DateTime.UtcNow
        };
        await collection.InsertOneAsync(actual);
        return actual;
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
                resident.ParticipatesInIds.Append(menuPlanId).ToArray()),
            cancellationToken: cancellationToken);

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