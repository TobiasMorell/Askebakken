using Askebakken.GraphQL.Schema;
using Askebakken.GraphQL.Schema.Errors;
using Askebakken.GraphQL.Schema.Mutations;
using Askebakken.GraphQL.Services;
using Askebakken.GraphQL.Tests.Fakes;

namespace Askebakken.GraphQL.Tests;

public class MenuPlanMutationsTests
{
    private readonly FakeResidentRepository _residentRepository = new();
    private readonly FakeMenuPlanRepository _menuPlanRepository = new();
    private readonly FakeUserService _userService = new();
    private readonly Mock<IMenuPlannerService> _menuPlannerService = new();

    private readonly MenuPlanMutations _mutations;

    public MenuPlanMutationsTests()
    {
        _mutations = new(_menuPlanRepository, _residentRepository, _userService, _menuPlannerService.Object);
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
        _residentRepository.AddMockData(new Resident() { Id = chefId, FirstName = "Chef", LastName = "John", });

        // Act and assert
        await Should.ThrowAsync<EventIsInThePastError>(() => _mutations.SignUpForCooking(date, chefId));
    }

    [Fact]
    public async Task SignUpForCooking_throws_TooManyCooksError_when_the_third_cook_tries_to_join()
    {
        // Arrange
        var menuPlan = new MenuPlan()
        {
            Id = Guid.NewGuid(), Date = DateTime.UtcNow, ChefIds = new[] { Guid.NewGuid(), Guid.NewGuid(), }
        };
        _menuPlanRepository.AddMockData(menuPlan);
        var chefId = Guid.NewGuid();
        _residentRepository.AddMockData(new Resident() { Id = chefId, FirstName = "Chef", LastName = "John", });

        // Act and assert
        await Should.ThrowAsync<TooManyCooksError>(() => _mutations.SignUpForCooking(menuPlan.Date, chefId));
    }

    [Fact]
    public async Task SignUpForCooking_creates_new_MenuPlan_when_it_does_not_exist()
    {
        // Arrange
        var date = DateTime.UtcNow.AddDays(5).Date;
        var chef = new Resident() { Id = Guid.NewGuid(), FirstName = "Chef", LastName = "John", };
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
        var menuPlan = new MenuPlan() { Id = Guid.NewGuid(), Date = DateTime.UtcNow.AddDays(5).Date, };
        _menuPlanRepository.AddMockData(menuPlan);
        var chef = new Resident() { Id = Guid.NewGuid(), FirstName = "Chef", LastName = "John", };
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
        var menuPlan = new MenuPlan() { Id = Guid.NewGuid(), Date = DateTime.UtcNow.AddDays(5).Date, };
        _menuPlanRepository.AddMockData(menuPlan);
        var chef = new Resident() { Id = Guid.NewGuid(), FirstName = "Chef", LastName = "John", };
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
        _residentRepository.AddMockData(new Resident() { Id = chefId, FirstName = "Chef", LastName = "John", });

        // Act and assert
        await Should.ThrowAsync<EventIsInThePastError>(() => _mutations.RemoveSignUpForCooking(date, chefId));
    }

    [Fact]
    public async Task RemoveSignUpForCooking_throws_NotFoundError_when_menu_plan_does_not_exist()
    {
        // Arrange
        var date = DateTime.UtcNow.AddDays(5).Date;
        var chef = new Resident() { Id = Guid.NewGuid(), FirstName = "Chef", LastName = "John", };
        _residentRepository.AddMockData(chef);

        // Act and assert
        await Should.ThrowAsync<NotFoundError>(() => _mutations.RemoveSignUpForCooking(date, chef.Id));
    }

    [Fact]
    public async Task RemoveSignUpForCooking_does_not_add_a_new_MenuPlan_if_one_exists_on_the_given_date()
    {
        // Arrange
        var menuPlan = new MenuPlan() { Id = Guid.NewGuid(), Date = DateTime.UtcNow.AddDays(5).Date, };
        _menuPlanRepository.AddMockData(menuPlan);
        var chef = new Resident() { Id = Guid.NewGuid(), FirstName = "Chef", LastName = "John", };
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
        var menuPlan = new MenuPlan() { Id = Guid.NewGuid(), Date = DateTime.UtcNow.AddDays(5).Date, };
        _menuPlanRepository.AddMockData(menuPlan);
        var chef = new Resident() { Id = Guid.NewGuid(), FirstName = "Chef", LastName = "John", };
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
        var chef = new Resident() { Id = Guid.NewGuid(), FirstName = "Chef", LastName = "John", };
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
        var chef = new Resident() { Id = Guid.NewGuid(), FirstName = "Chef", LastName = "John", };
        _residentRepository.AddMockData(chef);
        var menuPlan = new MenuPlan()
        {
            Id = Guid.NewGuid(), Date = DateTime.UtcNow.AddDays(5).Date, ChefIds = new[] { chef.Id },
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
}