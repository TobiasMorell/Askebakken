using Askebakken.GraphQL.Repository.MenuPlan;
using Askebakken.GraphQL.Repository.MenuPlanThumbnailCandidates;
using Askebakken.GraphQL.Repository.Recipe;
using Askebakken.GraphQL.Repository.Resident;
using Askebakken.GraphQL.Schema.Errors;
using Askebakken.GraphQL.Schema.Inputs;
using Askebakken.GraphQL.Schema.Results;
using Askebakken.GraphQL.Schema.Subscriptions.EventMessages;
using Askebakken.GraphQL.Services;
using Askebakken.GraphQL.Services.BlobService;
using Askebakken.GraphQL.Services.ImageGeneration;
using HotChocolate.Authorization;
using HotChocolate.Subscriptions;
using Path = System.IO.Path;

namespace Askebakken.GraphQL.Schema.Mutations;

[ExtendObjectType("Mutation")]
public class MenuPlanMutations
{
    private readonly IMenuPlanRepository _menuPlanRepository;
    private readonly IResidentRepository _residentRepository;
    private readonly IUserService _userService;
    private readonly IMenuPlannerService _menuPlannerService;
    private readonly IImageGenerationService _imageGenerationService;
    private readonly IBlobService _blobService;

    public MenuPlanMutations(IMenuPlanRepository menuPlanRepository,
        IResidentRepository residentRepository,
        IUserService userService,
        IMenuPlannerService menuPlannerService, IImageGenerationService imageGenerationService, IBlobService blobService)
    {
        _menuPlanRepository = menuPlanRepository;
        _residentRepository = residentRepository;
        _userService = userService;
        _menuPlannerService = menuPlannerService;
        _imageGenerationService = imageGenerationService;
        _blobService = blobService;
    }

    [Error<NotFoundError>]
    [Error<MenuPlanAlreadyExistsError>]
    [Authorize]
    public async Task<MenuPlan> CreateMenuPlan([Service] IRecipeRepository recipeRepo,
        CreateMenuPlanInput createMenuPlan,
        CancellationToken cancellationToken = default)
    {
        var existingMenuPlan = await _menuPlanRepository.GetMenuPlanByDate(createMenuPlan.Date, cancellationToken);
        if (existingMenuPlan is not null) throw new MenuPlanAlreadyExistsError(createMenuPlan.Date);

        var recipes = await recipeRepo.GetRecipesAsync(createMenuPlan.Recipes, cancellationToken);
        var foundRecipeIds = recipes.Select(r => r.Id).ToHashSet();
        var missingRecipeIds = createMenuPlan.Recipes.Where(r => !foundRecipeIds.Contains(r));
        if (missingRecipeIds.Any()) throw new NotFoundError(nameof(Recipe), missingRecipeIds);

        var actual = new MenuPlan()
        {
            Id = Guid.NewGuid(),
            RecipeIds = foundRecipeIds, ParticipantIds = Array.Empty<Guid>(), Date = createMenuPlan.Date.Date,
            Thumbnail = createMenuPlan.Thumbnail
        };

        await _menuPlanRepository.CreateMenuPlan(actual, cancellationToken);

        return actual;
    }

    [Error<NotFoundError>]
    [Error<MenuPlanAlreadyExistsError>]
    [Authorize]
    public async Task<IEnumerable<MenuPlan>> CreateWeekPlan([Service] IRecipeRepository recipeRepo,
        CreateWeekPlanInput createWeekPlan,
        CancellationToken cancellationToken = default)
    {
        var existingMenuPlans = await _menuPlanRepository.GetMenuPlansBetween(createWeekPlan.FromDate,
            createWeekPlan.FromDate.AddDays(5), cancellationToken);

        var weekRecipes = new[]
        {
            createWeekPlan.Monday, createWeekPlan.Tuesday, createWeekPlan.Wednesday, createWeekPlan.Thursday,
            createWeekPlan.Friday
        };
        var results = new List<MenuPlan>();
        for (var i = 0; i < 5; i++)
        {
            var date = createWeekPlan.FromDate.Date.AddDays(i);

            var recipes = await recipeRepo.BulkCreateRecipeAsync(weekRecipes[i].Recipes, cancellationToken);
            var recipeIds = recipes.Select(r => r.Id).ToHashSet();

            var existingMenuPlan = existingMenuPlans.FirstOrDefault(mp => mp.Date == date);
            if (existingMenuPlan is not null)
            {
                existingMenuPlan.RecipeIds = recipeIds;
                existingMenuPlan.Thumbnail = weekRecipes[i].Thumbnail ?? existingMenuPlan.Thumbnail;
                await _menuPlanRepository.Update(existingMenuPlan, cancellationToken);
            }
            else
            {
                existingMenuPlan = await CreateMenuPlan(recipeRepo,
                    new CreateMenuPlanInput()
                        { Date = date, Recipes = recipeIds, Thumbnail = weekRecipes[i].Thumbnail },
                    cancellationToken);
            }

            results.Add(existingMenuPlan);
        }

        return results;
    }

    [Error<NotFoundError>]
    [Authorize]
    public async Task<MenuPlan> ToggleAttendance(MenuPlanAttendanceInput input,
        CancellationToken cancellationToken = default)
    {
        var menuPlan = await _menuPlanRepository.GetMenuPlanById(input.MenuPlanId, cancellationToken);
        if (menuPlan is null) throw new NotFoundError(nameof(MenuPlan), input.MenuPlanId);

        var residentToAttend = input.ResidentId.HasValue
            ? await _residentRepository.GetResidentById(input.ResidentId.Value, cancellationToken)
            : await _userService.GetAuthenticatedUser(cancellationToken);
        if (residentToAttend is null) throw new NotFoundError(nameof(Resident), input.ResidentId ?? Guid.Empty);

        var participantIds = menuPlan.ParticipantIds.ToHashSet();
        if (participantIds.Contains(residentToAttend.Id))
            await _menuPlannerService.UnattendMenuPlan(menuPlan, residentToAttend, cancellationToken);
        else
            await _menuPlannerService.AttendMenuPlan(menuPlan, residentToAttend, cancellationToken);

        return menuPlan;
    }

    [Error<NotFoundError>]
    [Error<EventIsInThePastError>]
    [Authorize]
    public async Task<MenuPlan> SignUpForCooking(DateTime date,
        Guid? residentId = null,
        CancellationToken cancellationToken = default)
    {
        if (date.Date < DateTime.Today) throw new EventIsInThePastError();

        var chef = residentId.HasValue
            ? await _residentRepository.GetResidentById(residentId.Value, cancellationToken)
            : await _userService.GetAuthenticatedUser(cancellationToken);
        if (chef is null) throw new NotFoundError(nameof(Resident), residentId ?? Guid.Empty);

        var existingPlan = await _menuPlanRepository.GetMenuPlanByDate(date, cancellationToken);
        if (existingPlan is null)
        {
            existingPlan = new MenuPlan()
            {
                Date = date, RecipeIds = Array.Empty<Guid>(), ParticipantIds = Array.Empty<Guid>()
            };
            await _menuPlanRepository.CreateMenuPlan(existingPlan, cancellationToken);
        }
        else if (existingPlan.ChefIds?.Contains(chef.Id) is true)
        {
            return existingPlan;
        }
        else if (existingPlan.ChefIds is { Count: >= 2 })
        {
            throw new TooManyCooksError();
        }

        await _menuPlannerService.SignUpForCooking(existingPlan, chef, cancellationToken);
        await _menuPlannerService.AttendMenuPlan(existingPlan, chef, cancellationToken);

        return existingPlan;
    }

    [Error<NotFoundError>]
    [Error<EventIsInThePastError>]
    [Authorize]
    public async Task<MenuPlan> RemoveSignUpForCooking(DateTime date,
        Guid? residentId = null,
        bool? retainParticipation = null,
        CancellationToken cancellationToken = default)
    {
        if (date.Date < DateTime.Today) throw new EventIsInThePastError();

        var chef = residentId.HasValue
            ? await _residentRepository.GetResidentById(residentId.Value, cancellationToken)
            : await _userService.GetAuthenticatedUser(cancellationToken);
        if (chef is null) throw new NotFoundError(nameof(Resident), residentId ?? Guid.Empty);

        var existingPlan = await _menuPlanRepository.GetMenuPlanByDate(date, cancellationToken);
        if (existingPlan is null) throw new NotFoundError(nameof(MenuPlan));

        if (existingPlan.ChefIds?.Contains(chef.Id) is not true) return existingPlan;

        await _menuPlannerService.RemoveFromCooking(existingPlan, chef, cancellationToken);
        if (retainParticipation is not true)
            await _menuPlannerService.UnattendMenuPlan(existingPlan, chef, cancellationToken);

        return existingPlan;
    }

    [Error<NotFoundError>]
    [Error<EventIsInThePastError>]
    [Authorize]
    public async Task<MenuPlan> UpsertGuests([Service] ITopicEventSender eventSender, Guid menuPlanId,
        string houseNumber, int? numberOfChildGuests,
        int? numberOfAdultGuests, CancellationToken cancellationToken = default)
    {
        if (numberOfChildGuests is < 0) throw new InvalidInputError(nameof(numberOfChildGuests));

        if (numberOfAdultGuests is < 0) throw new InvalidInputError(nameof(numberOfAdultGuests));

        var houseResidents = await _residentRepository.GetResidentsByHouse(houseNumber, cancellationToken);
        if (!houseResidents.Any()) throw new InvalidInputError(nameof(houseNumber));

        var menuPlan = await _menuPlanRepository.GetMenuPlanById(menuPlanId, cancellationToken);
        if (menuPlan is null) throw new NotFoundError(nameof(MenuPlan), menuPlanId);

        if (menuPlan.Date.Date < DateTime.Today) throw new EventIsInThePastError();

        var existingGuests = menuPlan.Guests.FirstOrDefault(g => g.HouseNumber == houseNumber);
        if (existingGuests is not null)
        {
            existingGuests.NumberOfAdultGuests = numberOfAdultGuests ?? 0;
            existingGuests.NumberOfChildGuests = numberOfChildGuests ?? 0;
        }
        else
        {
            var newGuests = new Guest()
            {
                HouseNumber = houseNumber,
                NumberOfAdultGuests = numberOfAdultGuests ?? 0,
                NumberOfChildGuests = numberOfChildGuests ?? 0
            };
            menuPlan.Guests = menuPlan.Guests.Append(newGuests).ToArray();
        }

        // Filter out all guest entries where sum of guests is 0 to clean up data
        menuPlan.Guests = menuPlan.Guests.Where(g => g.NumberOfAdultGuests + g.NumberOfChildGuests > 0).ToArray();

        var updated = await _menuPlanRepository.Update(menuPlan, cancellationToken);

        await eventSender.SendAsync(MenuPlanUpdatedEventMessage.Topic,
            new MenuPlanUpdatedEventMessage(menuPlan), cancellationToken);

        return updated;
    }

    [Error<NotFoundError>]
    public async Task<GenerateMenuPlanThumbnailResult> GenerateThumbnail(
        [Service] IRecipeRepository recipeRepository,
        [Service] IMenuPlanThumbnailCandidatesRepository thumbnailRepo,
        GenerateMenuPlanThumbnails request,
        CancellationToken cancellationToken = default)
    {
        var existingCandidates =
            await thumbnailRepo.GetMenuPlanThumbnailCandidatesAsync(request.MenuPlanId, cancellationToken);
        if (existingCandidates is not null)
            return new GenerateMenuPlanThumbnailResult(existingCandidates.CandidateThumbnailUrls);

        var menuPlan = await _menuPlanRepository.GetMenuPlanById(request.MenuPlanId, cancellationToken);
        if (menuPlan is null) throw new NotFoundError(nameof(MenuPlan), request.MenuPlanId);

        var recipes = await recipeRepository.GetRecipesAsync(menuPlan.RecipeIds, cancellationToken);
        var imageUrls = await GenerateThumbnailsFor(menuPlan, recipes, request.NumberOfThumbnails,
            new ImageDimensions(request.ThumbnailSize, request.ThumbnailSize), cancellationToken);
        
        await thumbnailRepo.CreateMenuPlanThumbnailCandidatesAsync(new MenuPlanThumbnailCandidates()
        {
            MenuPlanId = menuPlan.Id,
            CandidateThumbnailUrls = imageUrls
        }, cancellationToken);

        return new(imageUrls);
    }

    private async Task<string[]> GenerateThumbnailsFor(MenuPlan menuPlan, IEnumerable<Recipe> recipes, int numberOfThumbnails, ImageDimensions? size = null, CancellationToken cancellationToken = default)
    {
        var prompt = GetMenuPlanImageGenerationPrompt(recipes);
        if (prompt is null)
            throw new InvalidInputError("Could not generate thumbnail for menu plan. No recipes found.");

        var images = await _imageGenerationService.GenerateImageAsync(prompt, numberOfThumbnails,
            size, cancellationToken);

        // Copy all images to wwwroot
        var baseDirectory =
            await _blobService.CreateDirectoryIfNotExists(Path.Combine("menu-plans", menuPlan.Id.ToString()),
                cancellationToken);

        return await Task.WhenAll(images.Select(i =>
            _blobService.CreateFileAsync(baseDirectory, $"{Guid.NewGuid()}.png", i, cancellationToken)));
    }

    private string? GetMenuPlanImageGenerationPrompt(IEnumerable<Recipe> recipes)
    {
        var mainRecipeName = recipes.FirstOrDefault(r => r.Category == "Main")?.Name;
        if (!string.IsNullOrWhiteSpace(mainRecipeName)) return mainRecipeName;
        var fallback = recipes.FirstOrDefault(r => !string.IsNullOrWhiteSpace(r.Name))?.Name;
        return fallback;
    }
}