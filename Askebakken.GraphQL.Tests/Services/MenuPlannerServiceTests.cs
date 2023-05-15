using Askebakken.GraphQL.Schema;
using Askebakken.GraphQL.Schema.Subscriptions;
using Askebakken.GraphQL.Services;
using Askebakken.GraphQL.Tests.Fakes;
using HotChocolate.Subscriptions;

namespace Askebakken.GraphQL.Tests.Services;

public class MenuPlannerServiceTests
{
    private readonly FakeMenuPlanRepository _menuPlanRepository = new();
    private readonly FakeResidentRepository _residentRepository = new();
    private readonly Mock<ITopicEventSender> _topicEventSender = new();
    
    private readonly MenuPlannerService _service;

    public MenuPlannerServiceTests()
    {
        _service = new(_menuPlanRepository, _residentRepository, _topicEventSender.Object);
    }

    [Fact]
    public async Task AttendMenuPlan_should_add_participant_to_menu_plan()
    {
        // Arrange
        var menuPlan = new MenuPlan
        {
            Id = Guid.NewGuid(),
            Date = DateTime.UtcNow.Date,
            ParticipantIds = Array.Empty<Guid>()
        };
        var resident = GenerateSampleResident(Guid.NewGuid());
        
        // Act
        await _service.AttendMenuPlan(menuPlan, resident);
        
        // Assert
        var updatedMenuPlan = _menuPlanRepository.UpdatedMenuPlans.ShouldHaveSingleItem();
        updatedMenuPlan.Id.ShouldBe(menuPlan.Id);
        updatedMenuPlan.ParticipantIds.ShouldContain(resident.Id);
    }
    
    [Fact]
    public async Task AttendMenuPlan_should_add_participation_to_resident()
    {
        // Arrange
        var menuPlan = new MenuPlan
        {
            Id = Guid.NewGuid(),
            Date = DateTime.UtcNow.Date,
            ParticipantIds = Array.Empty<Guid>()
        };
        var resident = GenerateSampleResident(Guid.NewGuid());
        
        // Act
        await _service.AttendMenuPlan(menuPlan, resident);
        
        // Assert
        var updatedResident = _residentRepository.UpdatedResidents.ShouldHaveSingleItem();
        updatedResident.Id.ShouldBe(resident.Id);
        updatedResident.ParticipatesInIds.ShouldContain(menuPlan.Id);
    }
    
    [Fact]
    public async Task AttendMenuPlan_should_send_event()
    {
        // Arrange
        var menuPlan = new MenuPlan
        {
            Id = Guid.NewGuid(),
            Date = DateTime.UtcNow.Date,
            ParticipantIds = Array.Empty<Guid>()
        };
        var resident = GenerateSampleResident(Guid.NewGuid());
        
        AttendanceChangedEventMessage? sentMessage = null;
        AddMessageTopicCallback<AttendanceChangedEventMessage>(AttendanceChangedEventMessage.Topic, msg => sentMessage = msg);
        
        // Act
        await _service.AttendMenuPlan(menuPlan, resident);
        
        // Assert
        sentMessage.ShouldNotBeNull();
        sentMessage.MenuPlanId.ShouldBe(menuPlan.Id);
        sentMessage.ResidentId.ShouldBe(resident.Id);
        sentMessage.Attending.ShouldBeTrue();
    }
    
    [Fact]
    public async Task UnattendMenuPlan_should_remove_participant_from_menu_plan()
    {
        // Arrange
        var resident = GenerateSampleResident(Guid.NewGuid());
        
        var menuPlan = new MenuPlan
        {
            Id = Guid.NewGuid(),
            Date = DateTime.UtcNow.Date,
            ParticipantIds = new[] { resident.Id }
        };
        
        resident.ParticipatesInIds.Add(menuPlan.Id);
        
        // Act
        await _service.UnattendMenuPlan(menuPlan, resident);
        
        // Assert
        var updatedMenuPlan = _menuPlanRepository.UpdatedMenuPlans.ShouldHaveSingleItem();
        updatedMenuPlan.Id.ShouldBe(menuPlan.Id);
        updatedMenuPlan.ParticipantIds.ShouldNotContain(resident.Id);
    }
    
    [Fact]
    public async Task UnattendMenuPlan_should_remove_participation_from_resident()
    {
        // Arrange
        var resident = GenerateSampleResident(Guid.NewGuid());
        
        var menuPlan = new MenuPlan
        {
            Id = Guid.NewGuid(),
            Date = DateTime.UtcNow.Date,
            ParticipantIds = new[] { resident.Id }
        };
        
        resident.ParticipatesInIds.Add(menuPlan.Id);
        
        // Act
        await _service.UnattendMenuPlan(menuPlan, resident);
        
        // Assert
        var updatedResident = _residentRepository.UpdatedResidents.ShouldHaveSingleItem();
        updatedResident.Id.ShouldBe(resident.Id);
        updatedResident.ParticipatesInIds.ShouldNotContain(menuPlan.Id);
    }
    
    [Fact]
    public async Task UnattendMenuPlan_should_send_event()
    {
        // Arrange
        var resident = GenerateSampleResident(Guid.NewGuid());
        
        var menuPlan = new MenuPlan
        {
            Id = Guid.NewGuid(),
            Date = DateTime.UtcNow.Date,
            ParticipantIds = new[] { resident.Id }
        };
        
        resident.ParticipatesInIds.Add(menuPlan.Id);
        
        AttendanceChangedEventMessage? sentMessage = null;
        AddMessageTopicCallback<AttendanceChangedEventMessage>(AttendanceChangedEventMessage.Topic, msg => sentMessage = msg);
        
        // Act
        await _service.UnattendMenuPlan(menuPlan, resident);
        
        // Assert
        sentMessage.ShouldNotBeNull();
        sentMessage.MenuPlanId.ShouldBe(menuPlan.Id);
        sentMessage.ResidentId.ShouldBe(resident.Id);
        sentMessage.Attending.ShouldBeFalse();
    }
   
    [Fact]
    public async Task SignUpForCooking_should_add_cook_to_menu_plan()
    {
        // Arrange
        var resident = GenerateSampleResident(Guid.NewGuid());
        
        var menuPlan = new MenuPlan
        {
            Id = Guid.NewGuid(),
            Date = DateTime.UtcNow.Date,
        };
        
        // Act
        await _service.SignUpForCooking(menuPlan, resident);
        
        // Assert
        var updatedMenuPlan = _menuPlanRepository.UpdatedMenuPlans.ShouldHaveSingleItem();
        updatedMenuPlan.Id.ShouldBe(menuPlan.Id);
        updatedMenuPlan.ChefIds.ShouldNotBeNull().ShouldContain(resident.Id);
    }
    
    [Fact]
    public async Task SignUpForCooking_should_add_menu_plan_to_resident_CooksInIds()
    {
        // Arrange
        var resident = GenerateSampleResident(Guid.NewGuid());
        
        var menuPlan = new MenuPlan
        {
            Id = Guid.NewGuid(),
            Date = DateTime.UtcNow.Date,
        };

        // Act
        await _service.SignUpForCooking(menuPlan, resident);
        
        // Assert
        var updatedResident = _residentRepository.UpdatedResidents.ShouldHaveSingleItem();
        updatedResident.Id.ShouldBe(resident.Id);
        updatedResident.CooksInIds.ShouldNotBeNull().ShouldContain(menuPlan.Id);
    }
    
    [Fact]
    public async Task RemoveFromCooking_should_remove_cook_from_menu_plan()
    {
        // Arrange
        var resident = GenerateSampleResident(Guid.NewGuid());
        
        var menuPlan = new MenuPlan
        {
            Id = Guid.NewGuid(),
            Date = DateTime.UtcNow.Date,
            ChefIds = new[] { resident.Id }
        };
        
        // Act
        await _service.RemoveFromCooking(menuPlan, resident);
        
        // Assert
        var updatedMenuPlan = _menuPlanRepository.UpdatedMenuPlans.ShouldHaveSingleItem();
        updatedMenuPlan.Id.ShouldBe(menuPlan.Id);
        updatedMenuPlan.ChefIds.ShouldNotBeNull().ShouldNotContain(resident.Id);
    }
    
    [Fact]
    public async Task RemoveFromCooking_should_remove_menu_plan_from_resident_CooksInIds()
    {
        // Arrange
        var resident = GenerateSampleResident(Guid.NewGuid());
        
        var menuPlan = new MenuPlan
        {
            Id = Guid.NewGuid(),
            Date = DateTime.UtcNow.Date,
            ChefIds = new[] { resident.Id }
        };
        
        // Act
        await _service.RemoveFromCooking(menuPlan, resident);
        
        // Assert
        var updatedResident = _residentRepository.UpdatedResidents.ShouldHaveSingleItem();
        updatedResident.Id.ShouldBe(resident.Id);
        updatedResident.CooksInIds.ShouldNotBeNull().ShouldNotContain(menuPlan.Id);
    }
    
    private static Resident GenerateSampleResident(Guid id, List<Guid>? participatesInIds = null) => new Resident
    {
        Id = id,
        ParticipatesInIds = participatesInIds ?? new(),
        Username = "testuser",
        PasswordHash = "testhash",
        HouseNumber = "1",
    };

    private void AddMessageTopicCallback<TMessage>(string topicName, Action<TMessage> callback)
    {
        _topicEventSender.Setup(x => x.SendAsync(topicName,
            It.IsAny<TMessage>(), It.IsAny<CancellationToken>())).Callback<string, TMessage, CancellationToken>((_, msg, _) =>
        {
            callback(msg);
        });
    }
}