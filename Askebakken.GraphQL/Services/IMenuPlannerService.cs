using Askebakken.GraphQL.Repository.MenuPlan;
using Askebakken.GraphQL.Repository.Resident;
using Askebakken.GraphQL.Schema;
using Askebakken.GraphQL.Schema.Subscriptions;
using HotChocolate.Subscriptions;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Services;

public interface IMenuPlannerService
{
    Task SignUpForCooking(MenuPlan menuPlan, Resident chef, CancellationToken cancellationToken = default);
    Task RemoveFromCooking(MenuPlan menuPlan, Resident chef, CancellationToken cancellationToken = default);
    Task AttendMenuPlan(MenuPlan menuPlan, Resident resident, CancellationToken cancellationToken = default);
    Task UnattendMenuPlan(MenuPlan menuPlan, Resident resident, CancellationToken cancellationToken = default);
}

public class MenuPlannerService : IMenuPlannerService
{
    private readonly IMenuPlanRepository _menuPlanRepository;
    private readonly IResidentRepository _residentRepository;
    private readonly ITopicEventSender _eventSender;

    public MenuPlannerService(IMenuPlanRepository menuPlanRepository,
        IResidentRepository residentRepository,
        ITopicEventSender eventSender)
    {
        _menuPlanRepository = menuPlanRepository;
        _residentRepository = residentRepository;
        _eventSender = eventSender;
    }

    public async Task SignUpForCooking(MenuPlan menuPlan, Resident chef, CancellationToken cancellationToken = default)
    {
        menuPlan.ChefIds = (menuPlan.ChefIds ?? Array.Empty<Guid>()).Append(chef.Id).ToArray();
        var updateMenuPlan = _menuPlanRepository.Update(menuPlan, cancellationToken: cancellationToken);

        chef.CooksInIds = (chef.CooksInIds ?? Array.Empty<Guid>()).Append(menuPlan.Id).ToArray();
        var updateResident = _residentRepository.Update(chef, cancellationToken: cancellationToken);

        await Task.WhenAll(updateMenuPlan, updateResident);
    }

    public async Task RemoveFromCooking(MenuPlan menuPlan, Resident chef, CancellationToken cancellationToken = default)
    {
        menuPlan.ChefIds = (menuPlan.ChefIds ?? Array.Empty<Guid>()).Where(c => c != chef.Id).ToArray();
        var updateMenuPlan = _menuPlanRepository.Update(menuPlan, cancellationToken: cancellationToken);

        chef.CooksInIds = (chef.CooksInIds ?? Array.Empty<Guid>()).Where(p => p != menuPlan.Id).ToArray();
        var updateResident = _residentRepository.Update(chef, cancellationToken: cancellationToken);

        await Task.WhenAll(updateMenuPlan, updateResident);
    }

    public async Task AttendMenuPlan(MenuPlan menuPlan,
        Resident resident,
        CancellationToken cancellationToken = default)
    {
        var participantIds = menuPlan.ParticipantIds.Append(resident.Id).ToHashSet();
        menuPlan.ParticipantIds = participantIds;
        var replaceMenuPlan = _menuPlanRepository.Update(menuPlan, cancellationToken: cancellationToken);

        resident.ParticipatesInIds = resident.ParticipatesInIds.Append(menuPlan.Id).ToArray();
        var updateResident = _residentRepository.Update(resident, cancellationToken: cancellationToken);

        await Task.WhenAll(replaceMenuPlan, updateResident);

        await _eventSender.SendAsync(AttendanceChangedEventMessage.Topic,
            new AttendanceChangedEventMessage(menuPlan.Id, resident.Id, true), cancellationToken);
    }

    public async Task UnattendMenuPlan(MenuPlan menuPlan,
        Resident resident,
        CancellationToken cancellationToken = default)
    {
        var participantIds = menuPlan.ParticipantIds.Where(p => p != resident.Id).ToHashSet();
        menuPlan.ParticipantIds = participantIds;
        var replaceMenuPlan = _menuPlanRepository.Update(menuPlan, cancellationToken: cancellationToken);

        resident.ParticipatesInIds = resident.ParticipatesInIds.Where(p => p != menuPlan.Id).ToArray();
        var updateResident = _residentRepository.Update(resident, cancellationToken: cancellationToken);

        await Task.WhenAll(replaceMenuPlan, updateResident);

        await _eventSender.SendAsync(AttendanceChangedEventMessage.Topic,
            new AttendanceChangedEventMessage(menuPlan.Id, resident.Id, false), cancellationToken);
    }
}