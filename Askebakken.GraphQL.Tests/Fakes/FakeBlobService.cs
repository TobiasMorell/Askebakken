using Askebakken.GraphQL.Services.BlobService;

namespace Askebakken.GraphQL.Tests.Fakes;

internal class FakeBlobService : IBlobService
{
    private readonly List<DirectoryCreation> _directoryCreations = new();
    private readonly List<FileCreation> _fileCreations = new();
    
    public IReadOnlyList<DirectoryCreation> DirectoryCreations => _directoryCreations;
    public IReadOnlyList<FileCreation> FileCreations => _fileCreations;
    
    public Task<string> CreateDirectoryIfNotExists(string directoryPath, CancellationToken cancellationToken = default)
    {
        _directoryCreations.Add(new DirectoryCreation(directoryPath));
        return Task.FromResult(directoryPath);
    }

    public Task<string> CreateFileAsync(string directoryPath, string fileName, Stream content,
        CancellationToken cancellationToken = default)
    {
        _fileCreations.Add(new FileCreation(directoryPath, fileName, content));
        return Task.FromResult(Path.Combine(directoryPath, fileName));
    }
}

internal record DirectoryCreation(string DirectoryPath);
internal record FileCreation(string DirectoryPath, string FileName, Stream Content);