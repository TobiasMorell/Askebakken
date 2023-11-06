using Askebakken.GraphQL.Repository.MenuPlanThumbnailCandidates;
using Askebakken.GraphQL.Schema;

namespace Askebakken.GraphQL.Tests.Fakes;

public class FakeMenuPlanThumbnailCandidateRepository : FakeRepositoryBase<MenuPlanThumbnailCandidates>, IMenuPlanThumbnailCandidatesRepository
{
    public Task<MenuPlanThumbnailCandidates?> GetMenuPlanThumbnailCandidatesAsync(Guid menuPlanId, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(MockData.FirstOrDefault(t => t.MenuPlanId == menuPlanId));
    }

    public Task<MenuPlanThumbnailCandidates> CreateMenuPlanThumbnailCandidatesAsync(MenuPlanThumbnailCandidates input,
        CancellationToken cancellationToken = default)
    {
        MockData.Add(input);
        return Task.FromResult(input);
    }
}