namespace Askebakken.GraphQL.Services.ImageGeneration;

public interface IImageGenerationService
{
    Task<MemoryStream[]> GenerateImageAsync(string text, int noImages = 1, ImageDimensions? dimensions = null,  CancellationToken cancellationToken = default);
}