namespace Askebakken.GraphQL.Schema.Inputs;

public record GenerateMenuPlanThumbnails(Guid MenuPlanId, int NumberOfThumbnails = 9, int ThumbnailSize = 1024);