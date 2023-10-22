using Askebakken.GraphQL.Schema;
using Askebakken.GraphQL.Schema.Errors;
using Askebakken.GraphQL.Schema.Inputs;
using Askebakken.GraphQL.Schema.Mutations;
using Askebakken.GraphQL.Schema.Subscriptions.EventMessages;
using Askebakken.GraphQL.Services;
using Askebakken.GraphQL.Tests.Fakes;
using HotChocolate.Subscriptions;

namespace Askebakken.GraphQL.Tests;

public class MenuPlanMutationsTests
{
    private readonly FakeResidentRepository _residentRepository = new();
    private readonly FakeMenuPlanRepository _menuPlanRepository = new();
    private readonly FakeRecipeRepo _recipeRepo = new();
    private readonly FakeUserService _userService = new();
    private readonly Mock<IMenuPlannerService> _menuPlannerService = new();
    private readonly Mock<ITopicEventSender> _topicEventSender = new();

    private readonly MenuPlanMutations _mutations;

    public MenuPlanMutationsTests()
    {
        _mutations = new MenuPlanMutations(_menuPlanRepository, _residentRepository, _userService,
            _menuPlannerService.Object);
    }

    [Fact]
    public async Task CreateMenuPlan_throws_NotFoundError_when_given_invalid_recipe_id()
    {
        // Arrange
        var recipeId = Guid.NewGuid();

        // Act and assert
        await Should.ThrowAsync<NotFoundError>(() => _mutations.CreateMenuPlan(_recipeRepo, new CreateMenuPlanInput()
        {
            Date = DateTime.Today.AddDays(1),
            Recipes = new List<Guid>()
            {
                recipeId
            }
        }));
    }

    [Fact]
    public async Task CreateMenuPlan_creates_menu_plan_if_it_does_not_already_exist()
    {
        // Arrange
        var recipe = await _recipeRepo.CreateRecipeAsync(new CreateRecipeInput()
        {
            Name = "Testsagna",
            Category = "Main"
        });

        // Act
        var menuPlan = await _mutations.CreateMenuPlan(_recipeRepo, new CreateMenuPlanInput()
        {
            Date = DateTime.Today.AddDays(1),
            Recipes = new List<Guid>()
            {
                recipe.Id
            }
        });

        // Assert
        var menuPlanFromDb = _menuPlanRepository.CreatedMenuPlans.ShouldHaveSingleItem();
        menuPlanFromDb.ShouldNotBeNull();
        menuPlanFromDb.ShouldBeEquivalentTo(menuPlan);
    }

    [Fact]
    public async Task CreateMenuPlan_throws_MenuPlanAlreadyExistsError_if_a_menu_plan_exists_on_the_given_date()
    {
        // Arrange
        var date = DateTime.UtcNow.AddDays(3);
        var menuPlan = new MenuPlan() { Id = Guid.NewGuid(), Date = date };
        _menuPlanRepository.AddMockData(menuPlan);

        // Act and assert
        var exception = await Should.ThrowAsync<MenuPlanAlreadyExistsError>(() => _mutations.CreateMenuPlan(_recipeRepo,
            new CreateMenuPlanInput()
            {
                Date = date,
                Recipes = new List<Guid>()
                {
                    Guid.NewGuid()
                }
            }));
        exception.Date.ShouldBe(date);
    }

    [Fact]
    public async Task SignUpForCooking_throws_NotFoundError_when_ChefId_is_invalid()
    {
        // Arrange
        var date = DateTime.UtcNow.AddDays(5).Date;
        var chefId = Guid.NewGuid();

        // Act and assert
        await Should.ThrowAsync<NotFoundError>(() => _mutations.SignUpForCooking(date, chefId));
    }

    [Fact]
    public async Task SignUpForCooking_throws_EventIsInThePastError_when_date_is_in_the_past()
    {
        // Arrange
        var date = DateTime.UtcNow.AddDays(-1);
        var chefId = Guid.NewGuid();
        _residentRepository.AddMockData();

        // Act and assert
        await Should.ThrowAsync<EventIsInThePastError>(() => _mutations.SignUpForCooking(date, chefId));
    }

    [Fact]
    public async Task SignUpForCooking_throws_TooManyCooksError_when_the_third_cook_tries_to_join()
    {
        // Arrange
        var menuPlan = new MenuPlan()
        {
            Id = Guid.NewGuid(), Date = DateTime.UtcNow, ChefIds = new[] { Guid.NewGuid(), Guid.NewGuid() }
        };
        _menuPlanRepository.AddMockData(menuPlan);
        var chefId = Guid.NewGuid();
        _residentRepository.AddMockData(GenerateSampleResident(chefId));

        // Act and assert
        await Should.ThrowAsync<TooManyCooksError>(() => _mutations.SignUpForCooking(menuPlan.Date, chefId));
    }

    [Fact]
    public async Task SignUpForCooking_creates_new_MenuPlan_when_it_does_not_exist()
    {
        // Arrange
        var date = DateTime.UtcNow.AddDays(5).Date;
        var chef = GenerateSampleResident(Guid.NewGuid());
        _residentRepository.AddMockData(chef);

        // Act
        var menuPlan = await _mutations.SignUpForCooking(date, chef.Id);

        // Assert
        var menuPlanFromDb = _menuPlanRepository.CreatedMenuPlans.ShouldHaveSingleItem();
        menuPlanFromDb.Date.ShouldBe(date);
        menuPlan.Id.ShouldBe(menuPlanFromDb.Id);
    }

    [Fact]
    public async Task SignUpForCooking_does_not_add_a_new_MenuPlan_if_one_exists_on_the_given_date()
    {
        // Arrange
        var menuPlan = new MenuPlan() { Id = Guid.NewGuid(), Date = DateTime.UtcNow.AddDays(5).Date };
        _menuPlanRepository.AddMockData(menuPlan);
        var chef = GenerateSampleResident(Guid.NewGuid());
        _residentRepository.AddMockData(chef);

        // Act
        await _mutations.SignUpForCooking(menuPlan.Date, chef.Id);

        // Assert
        var menuPlanFromDb = await _menuPlanRepository.GetMenuPlansBetween(menuPlan.Date, menuPlan.Date.AddDays(1));
        menuPlanFromDb.ShouldHaveSingleItem().Id.ShouldBe(menuPlan.Id);
    }

    [Fact]
    public async Task SignUpForCooking_signs_up_the_given_user_for_cooking_and_participation_on_the_MenuPlan()
    {
        // Arrange
        var menuPlan = new MenuPlan() { Id = Guid.NewGuid(), Date = DateTime.UtcNow.AddDays(5).Date };
        _menuPlanRepository.AddMockData(menuPlan);
        var chef = GenerateSampleResident(Guid.NewGuid());
        _residentRepository.AddMockData(chef);

        // Act
        await _mutations.SignUpForCooking(menuPlan.Date, chef.Id);

        // Assert
        _menuPlannerService.Verify(mps => mps.SignUpForCooking(menuPlan, chef, It.IsAny<CancellationToken>()),
            Times.Once);
        _menuPlannerService.Verify(mps => mps.AttendMenuPlan(menuPlan, chef, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task RemoveSignUpForCooking_throws_NotFoundError_when_ChefId_is_invalid()
    {
        // Arrange
        var date = DateTime.UtcNow.AddDays(5).Date;
        var chefId = Guid.NewGuid();

        // Act and assert
        await Should.ThrowAsync<NotFoundError>(() => _mutations.RemoveSignUpForCooking(date, chefId));
    }

    [Fact]
    public async Task RemoveSignUpForCooking_throws_EventIsInThePastError_when_date_is_in_the_past()
    {
        // Arrange
        var date = DateTime.UtcNow.AddDays(-1);
        var chefId = Guid.NewGuid();
        _residentRepository.AddMockData(GenerateSampleResident(chefId));

        // Act and assert
        await Should.ThrowAsync<EventIsInThePastError>(() => _mutations.RemoveSignUpForCooking(date, chefId));
    }

    [Fact]
    public async Task RemoveSignUpForCooking_throws_NotFoundError_when_menu_plan_does_not_exist()
    {
        // Arrange
        var date = DateTime.UtcNow.AddDays(5).Date;
        var chef = GenerateSampleResident(Guid.NewGuid());
        _residentRepository.AddMockData(chef);

        // Act and assert
        await Should.ThrowAsync<NotFoundError>(() => _mutations.RemoveSignUpForCooking(date, chef.Id));
    }

    [Fact]
    public async Task RemoveSignUpForCooking_does_not_add_a_new_MenuPlan_if_one_exists_on_the_given_date()
    {
        // Arrange
        var menuPlan = new MenuPlan() { Id = Guid.NewGuid(), Date = DateTime.UtcNow.AddDays(5).Date };
        _menuPlanRepository.AddMockData(menuPlan);
        var chef = GenerateSampleResident(Guid.NewGuid());
        _residentRepository.AddMockData(chef);

        // Act
        await _mutations.RemoveSignUpForCooking(menuPlan.Date, chef.Id);

        // Assert
        var menuPlanFromDb = await _menuPlanRepository.GetMenuPlansBetween(menuPlan.Date, menuPlan.Date.AddDays(1));
        menuPlanFromDb.ShouldHaveSingleItem().Id.ShouldBe(menuPlan.Id);
    }

    [Fact]
    public async Task RemoveSignUpForCooking_does_nothing_if_the_user_is_not_signed_up_for_cooking()
    {
        // Arrange
        var menuPlan = new MenuPlan() { Id = Guid.NewGuid(), Date = DateTime.UtcNow.AddDays(5).Date };
        _menuPlanRepository.AddMockData(menuPlan);
        var chef = GenerateSampleResident(Guid.NewGuid());
        _userService.MockAuthenticatedUser(chef);

        // Act
        await _mutations.RemoveSignUpForCooking(menuPlan.Date);

        // Assert
        _menuPlannerService.Verify(mps => mps.RemoveFromCooking(menuPlan, chef, It.IsAny<CancellationToken>()),
            Times.Never);
        _menuPlannerService.Verify(mps => mps.UnattendMenuPlan(menuPlan, chef, It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task
        RemoveSignUpForCooking_removes_the_user_as_chef_but_retains_participation_on_the_MenuPlan_when_RetainParticipation_is_true()
    {
        // Arrange
        var chef = GenerateSampleResident(Guid.NewGuid());
        _residentRepository.AddMockData(chef);
        var menuPlan = new MenuPlan()
        {
            Id = Guid.NewGuid(), Date = DateTime.UtcNow.AddDays(5).Date, ChefIds = new[] { chef.Id }
        };
        _menuPlanRepository.AddMockData(menuPlan);

        // Act
        await _mutations.RemoveSignUpForCooking(menuPlan.Date, chef.Id, true);

        // Assert
        _menuPlannerService.Verify(mps => mps.RemoveFromCooking(menuPlan, chef, It.IsAny<CancellationToken>()),
            Times.Once);
        _menuPlannerService.Verify(mps => mps.UnattendMenuPlan(menuPlan, chef, It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task
        RemoveSignUpForCooking_removes_the_user_as_chef_and_participation_on_the_MenuPlan_when_RetainParticipation_is_false()
    {
        // Arrange
        var chef = GenerateSampleResident(Guid.NewGuid());
        _residentRepository.AddMockData(chef);
        var menuPlan = new MenuPlan()
        {
            Id = Guid.NewGuid(), Date = DateTime.UtcNow.AddDays(5).Date, ChefIds = new[] { chef.Id }
        };
        _menuPlanRepository.AddMockData(menuPlan);

        // Act
        await _mutations.RemoveSignUpForCooking(menuPlan.Date, chef.Id, false);

        // Assert
        _menuPlannerService.Verify(mps => mps.RemoveFromCooking(menuPlan, chef, It.IsAny<CancellationToken>()),
            Times.Once);
        _menuPlannerService.Verify(mps => mps.UnattendMenuPlan(menuPlan, chef, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task UpsertGuests_throws_NotFoundError_on_nonexisting_menu_plan_id()
    {
        // Arrange
        var menuPlanId = Guid.NewGuid();
        var houseNumber = "2C";
        var numberOfAdults = 1;
        _residentRepository.AddMockData(GenerateSampleResident(Guid.NewGuid(), houseNumber));

        // Act
        await Should.ThrowAsync<NotFoundError>(() =>
            _mutations.UpsertGuests(_topicEventSender.Object, menuPlanId, houseNumber, null, numberOfAdults));
    }

    [Fact]
    public async Task UpsertGuests_throws_InputValidationError_if_numberOfAdults_is_negative()
    {
        // Arrange
        var menuPlanId = Guid.NewGuid();
        var houseNumber = "2C";
        var numberOfAdults = -1;

        // Act
        await Should.ThrowAsync<InvalidInputError>(() =>
            _mutations.UpsertGuests(_topicEventSender.Object, menuPlanId, houseNumber, null, numberOfAdults));
    }

    [Fact]
    public async Task UpsertGuests_throws_InputValidationError_if_numberOfChildren_is_negative()
    {
        // Arrange
        var menuPlanId = Guid.NewGuid();
        var houseNumber = "2C";
        var numberOfAdults = 1;
        var numberOfChildren = -1;

        // Act
        await Should.ThrowAsync<InvalidInputError>(() =>
            _mutations.UpsertGuests(_topicEventSender.Object, menuPlanId, houseNumber, numberOfChildren,
                numberOfAdults));
    }

    [Fact]
    public async Task UpsertGuests_throws_EventIsInThePastError_if_the_date_is_before_today()
    {
        // Arrange
        var menuPlanId = Guid.NewGuid();
        var menuPlan = GenerateSampleMenuPlan(menuPlanId);
        menuPlan.Date = DateTime.Today.AddDays(-1);
        _menuPlanRepository.AddMockData(menuPlan);
        var houseNumber = "2C";
        var numberOfAdults = 1;
        _residentRepository.AddMockData(GenerateSampleResident(Guid.NewGuid(), houseNumber));

        // Act
        await Should.ThrowAsync<EventIsInThePastError>(() =>
            _mutations.UpsertGuests(_topicEventSender.Object, menuPlanId, houseNumber, null, numberOfAdults));
    }

    [Fact]
    public async Task UpsertGuests_throws_InvalidInputError_if_the_no_residents_live_in_the_given_house()
    {
        // Arrange
        var menuPlanId = Guid.NewGuid();
        var menuPlan = GenerateSampleMenuPlan(menuPlanId);
        _menuPlanRepository.AddMockData(menuPlan);
        var houseNumber = "2C";
        var numberOfAdults = 1;

        // Act
        await Should.ThrowAsync<InvalidInputError>(() =>
            _mutations.UpsertGuests(_topicEventSender.Object, menuPlanId, houseNumber, null, numberOfAdults));
    }

    [Fact]
    public async Task UpsertGuests_removes_guests_for_house_if_both_children_and_adults_are_null()
    {
        // Arrange
        var houseNumber = "2C";
        var menuPlanId = Guid.NewGuid();
        _menuPlanRepository.AddMockData(GenerateSampleMenuPlan(menuPlanId,
            new Guest() { HouseNumber = houseNumber, NumberOfAdultGuests = 2 }));
        _residentRepository.AddMockData(GenerateSampleResident(Guid.NewGuid(), houseNumber));
        int? numberOfAdults = null;
        int? numberOfChildren = null;

        // Act
        var result = await _mutations.UpsertGuests(_topicEventSender.Object, menuPlanId, houseNumber, numberOfChildren,
            numberOfAdults);

        // Assert
        result.Id.ShouldBe(menuPlanId);
        result.Guests.ShouldBeEmpty();
    }

    [Fact]
    public async Task UpsertGuests_removes_guests_for_house_if_both_children_and_adults_are_0()
    {
        // Arrange
        var houseNumber = "2C";
        var menuPlanId = Guid.NewGuid();
        _menuPlanRepository.AddMockData(GenerateSampleMenuPlan(menuPlanId,
            new Guest() { HouseNumber = houseNumber, NumberOfAdultGuests = 2 }));
        _residentRepository.AddMockData(GenerateSampleResident(Guid.NewGuid(), houseNumber));
        var numberOfAdults = 0;
        var numberOfChildren = 0;

        // Act
        var result = await _mutations.UpsertGuests(_topicEventSender.Object, menuPlanId, houseNumber, numberOfChildren,
            numberOfAdults);

        // Assert
        result.Id.ShouldBe(menuPlanId);
        result.Guests.ShouldBeEmpty();
    }

    [Fact]
    public async Task UpsertGuests_updates_guests_for_house_if_they_already_exist()
    {
        // Arrange
        var houseNumber = "2C";
        var menuPlanId = Guid.NewGuid();
        _menuPlanRepository.AddMockData(GenerateSampleMenuPlan(menuPlanId,
            new Guest() { HouseNumber = houseNumber, NumberOfAdultGuests = 2 }));
        _residentRepository.AddMockData(GenerateSampleResident(Guid.NewGuid(), houseNumber));
        var numberOfAdults = 2;
        var numberOfChildren = 2;

        // Act
        var result = await _mutations.UpsertGuests(_topicEventSender.Object, menuPlanId, houseNumber, numberOfChildren,
            numberOfAdults);

        // Assert
        result.Id.ShouldBe(menuPlanId);
        var guest = result.Guests.ShouldHaveSingleItem();
        guest.HouseNumber.ShouldBe(houseNumber);
        guest.NumberOfAdultGuests.ShouldBe(numberOfAdults);
        guest.NumberOfChildGuests.ShouldBe(numberOfChildren);
    }

    [Fact]
    public async Task UpsertGuests_adds_guests_for_house_if_they_do_not_exist()
    {
        // Arrange
        var houseNumber = "2C";
        var menuPlanId = Guid.NewGuid();
        _menuPlanRepository.AddMockData(GenerateSampleMenuPlan(menuPlanId));
        _residentRepository.AddMockData(GenerateSampleResident(Guid.NewGuid(), houseNumber));
        var numberOfAdults = 2;
        var numberOfChildren = 0;

        // Act
        var result = await _mutations.UpsertGuests(_topicEventSender.Object, menuPlanId, houseNumber, numberOfChildren,
            numberOfAdults);

        // Assert
        result.Id.ShouldBe(menuPlanId);
        var guest = result.Guests.ShouldHaveSingleItem();
        guest.HouseNumber.ShouldBe(houseNumber);
        guest.NumberOfAdultGuests.ShouldBe(numberOfAdults);
        guest.NumberOfChildGuests.ShouldBe(numberOfChildren);
    }

    [Fact]
    public async Task UpsertGuests_triggers_MenuPlanUpdated_event()
    {
        // Arrange
        var houseNumber = "2C";
        var menuPlanId = Guid.NewGuid();
        _menuPlanRepository.AddMockData(GenerateSampleMenuPlan(menuPlanId));
        _residentRepository.AddMockData(GenerateSampleResident(Guid.NewGuid(), houseNumber));
        var numberOfAdults = 2;
        var numberOfChildren = 0;

        // Act
        var result = await _mutations.UpsertGuests(_topicEventSender.Object, menuPlanId, houseNumber, numberOfChildren,
            numberOfAdults);

        // Assert
        _topicEventSender.Verify(
            s => s.SendAsync(MenuPlanUpdatedEventMessage.Topic,
                It.Is<MenuPlanUpdatedEventMessage>(m => m.UpdatedMenuPlan.Id == menuPlanId),
                It.IsAny<CancellationToken>()), Times.Once);
    }

    private static Resident GenerateSampleResident(Guid id, string houseNumber = "")
    {
        return new Resident
        {
            Id = id, FirstName = "Chef", LastName = "John", Username = "chefjohn", PasswordHash = "password",
            HouseNumber = houseNumber
        };
    }

    private static MenuPlan GenerateSampleMenuPlan(Guid id, params Guest[] guests)
    {
        return new MenuPlan { Id = id, Date = DateTime.Today.AddDays(4), Guests = guests };
    }
}