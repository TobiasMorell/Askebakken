namespace Askebakken.GraphQL.Repository.MenuPlanThumbnailCandidates;

public interface IMenuPlanThumbnailCandidatesRepository
{
    Task<Schema.MenuPlanThumbnailCandidates?> GetMenuPlanThumbnailCandidatesAsync(Guid menuPlanId, CancellationToken cancellationToken = default);
    Task<Schema.MenuPlanThumbnailCandidates> CreateMenuPlanThumbnailCandidatesAsync(Schema.MenuPlanThumbnailCandidates input, CancellationToken cancellationToken = default);
}