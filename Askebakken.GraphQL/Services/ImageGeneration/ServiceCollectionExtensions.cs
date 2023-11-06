using Askebakken.GraphQL.Services.ImageGeneration.OpenAPI;

namespace Askebakken.GraphQL.Services.ImageGeneration;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddOpenApiImageGeneration(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpClient();
        services.Configure<OpenApiImageGenerationOptions>(configuration.GetSection(nameof(OpenApiImageGenerationOptions)));
        services.AddSingleton<IImageGenerationService, OpenApiImageGenerationService>();
        return services;
    }
}