using Askebakken.GraphQL.Services.ImageGeneration;

namespace Askebakken.GraphQL.Tests.Fakes;

public record FakeImageGenerationRequest(string Text, int NoImages, ImageDimensions? Dimensions);

public class FakeImageGenerationService : IImageGenerationService
{
    public bool ThrowOnGenerateImage { get; set; }
    
    private readonly List<FakeImageGenerationRequest> _requests = new();
    public IReadOnlyList<FakeImageGenerationRequest> Requests => _requests;
    
    public Task<MemoryStream[]> GenerateImageAsync(string text, int noImages = 1, ImageDimensions? dimensions = null,
        CancellationToken cancellationToken = default)
    {
        if (ThrowOnGenerateImage)
        {
            throw new ApplicationException("FakeImageGenerationService threw an exception");
        }
        
        _requests.Add(new FakeImageGenerationRequest(text, noImages, dimensions));
        return Task.FromResult(new MemoryStream[noImages]);
    }
}