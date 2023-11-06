namespace Askebakken.GraphQL.Services.BlobService;

public interface IBlobService
{
    Task<string> CreateDirectoryIfNotExists(string directoryPath, CancellationToken cancellationToken = default);
    Task<string> CreateFileAsync(string directoryPath, string fileName, Stream content, CancellationToken cancellationToken = default);
}