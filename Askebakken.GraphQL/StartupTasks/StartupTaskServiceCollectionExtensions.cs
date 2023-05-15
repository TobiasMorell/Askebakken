namespace Askebakken.GraphQL.StartupTasks;

public static class StartupTaskServiceCollectionExtensions
{
    /// <summary>
    /// Add a startup task to the <paramref name="services"/>.
    /// Startup tasks can be executed after building the <see cref="IServiceProvider"/> and running <see cref="ExecuteStartupTasks(IServiceProvider)"/>.
    /// </summary>
    /// <typeparam name="TStartupTask">The startup task to add.</typeparam>
    /// <param name="services">The service collection to add the startup task to.</param>
    /// <returns>The <paramref name="services"/> for chaining.</returns>
    public static IServiceCollection AddStartupTask<TStartupTask>(this IServiceCollection services)
        where TStartupTask : class, IStartupTask
    {
        services.AddTransient<IStartupTask, TStartupTask>();

        return services;
    }

    /// <summary>
    /// Add a startup task to the <paramref name="services"/>.
    /// Startup tasks can be executed after building the <see cref="IServiceProvider"/> and running <see cref="ExecuteStartupTasks(IServiceProvider)"/>.
    /// </summary>
    /// <param name="services">The service collection to add the startup task to.</param>
    /// <param name="startupTaskType">The startup task to add.</param>
    /// <returns>The <paramref name="services"/> for chaining.</returns>
    public static IServiceCollection AddStartupTask(
        this IServiceCollection services,
        Type startupTaskType
    )
    {
        if (!startupTaskType.IsAssignableTo(typeof(IStartupTask)))
            throw new ArgumentOutOfRangeException(
                nameof(startupTaskType),
                $"{startupTaskType?.Name ?? "<null>"} is not a {nameof(IStartupTask)}"
            );
        if (startupTaskType.IsInterface)
            throw new ArgumentOutOfRangeException(
                nameof(startupTaskType),
                $"{startupTaskType?.Name ?? "<null>"} is an interface"
            );

        services.AddTransient(typeof(IStartupTask), startupTaskType);

        return services;
    }

    /// <summary>
    /// Add a startup task to the <paramref name="services"/>.
    /// Startup tasks can be executed after building the <see cref="IServiceProvider"/> and running <see cref="ExecuteStartupTasks(IServiceProvider)"/>.
    /// </summary>
    /// <typeparam name="TStartupTask">The type of startup task to add.</typeparam>
    /// <param name="services">The service collection to add the startup task to.</param>
    /// <param name="startupTask">The startup task to add.</param>
    /// <returns>The <paramref name="services"/> for chaining.</returns>
    public static IServiceCollection AddStartupTask<TStartupTask>(
        this IServiceCollection services,
        TStartupTask startupTask
    ) where TStartupTask : class, IStartupTask
    {
        services.AddSingleton(typeof(IStartupTask), startupTask);

        return services;
    }

    /// <summary>
    /// <para>
    /// Execute the start-up tasks registered on the given service provider.
    /// </para>
    /// <para>
    /// See <see cref="IStartupTask"/>.
    /// </para>
    /// </summary>
    /// <param name="services">The service provider to run start-up tasks on.</param>
    /// <param name="cancellationToken">A cancellation token to abort the execution.</param>
    /// <returns>A task for async.</returns>
    public static async Task<IServiceProvider> ExecuteStartupTasks(this IServiceProvider services, CancellationToken cancellationToken = default)
    {
        var loggerFactory = services.GetService<ILoggerFactory>();

        foreach (var startupTask in services.GetServices<IStartupTask>())
        {
            var logger = loggerFactory?.CreateLogger(startupTask.GetType());
            try
            {
                await startupTask.ExecuteAsync(cancellationToken);
            }
            catch (Exception e)
            {
                if (logger is not null)
                {
                    logger.Log(LogLevel.Error, e, "Error executing startup task {StartupTask}",
                        startupTask.GetType().Name);
                }
                else
                {
                    Console.WriteLine(e);
                }
            }
        }

        return services;
    }
}