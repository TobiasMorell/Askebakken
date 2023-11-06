namespace Askebakken.GraphQL.Schema;

public class MenuPlanThumbnailCandidates : SchemaBase
{
    public required Guid MenuPlanId { get; set; }
    public required string[] CandidateThumbnailUrls { get; set; }
}