namespace Askebakken.GraphQL.StartupTasks;

public interface IStartupTask
{
    Task ExecuteAsync(CancellationToken cancellationToken = default);
}