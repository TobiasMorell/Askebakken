using Path = System.IO.Path;

namespace Askebakken.GraphQL.Services.BlobService;

public class WwwRootBlobService : IBlobService
{
    private readonly string _wwwrootDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
    
    public Task<string> CreateDirectoryIfNotExists(string directoryPath, CancellationToken cancellationToken = default)
    {
        var menuPlanFolder = Path.Combine(_wwwrootDirectory, directoryPath);
        if (!Directory.Exists(menuPlanFolder))
        {
            Directory.CreateDirectory(menuPlanFolder);
        }

        return Task.FromResult(directoryPath);
    }

    public async Task<string> CreateFileAsync(string directoryPath, string fileName, Stream content,
        CancellationToken cancellationToken = default)
    {
        var path = Path.Combine(directoryPath, fileName);
        await using var fileStream = new FileStream(Path.Combine(_wwwrootDirectory, path), FileMode.Create);
        await content.CopyToAsync(fileStream, cancellationToken);

        return path;
    }
}