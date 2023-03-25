using System.Reflection;
using Askebakken.GraphQL.Options;
using Askebakken.GraphQL.Schema;
using Askebakken.GraphQL.Schema.Mutations;
using Askebakken.GraphQL.Schema.Queries;
using HotChocolate.Execution.Configuration;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Extensions;

public static class GraphQlMongoDbServiceCollectionExtensions
{
    private static readonly Type[] SchemaTypes = Assembly.GetExecutingAssembly().GetTypes()
        .Where(t => t.IsAssignableTo(typeof(SchemaBase)) && !t.IsAbstract).ToArray();
    
    public static IServiceCollection AddMongoDb(this IServiceCollection services, MongoDbConnectionOptions options)
    {
        var client = new MongoClient(options.ConnectionString);
        var database = client.GetDatabase(options.DatabaseName);

        var getCollectionMethod = typeof(IMongoDatabase).GetMethod(nameof(database.GetCollection));
        foreach (var type in SchemaTypes)
        {
            var getCollectionTyped = getCollectionMethod.MakeGenericMethod(type);
            services.AddSingleton(typeof(IMongoCollection<>).MakeGenericType(type), getCollectionTyped.Invoke(database, new [] { type.Name + "s", null }));
        }

        return services;
    }
    
    public static IRequestExecutorBuilder AddMongoQueryProviders(this IRequestExecutorBuilder services)
    {
        var typeConfigs = Assembly.GetExecutingAssembly().GetTypes().Where(t => t.IsAssignableTo(typeof(ObjectType)));
        foreach (var typeConfig in typeConfigs)
        {
            services.AddType(typeConfig);
        }
        
        services.AddQueryType(q => q.Name("Query"))
            .AddType<MenuPlanQuery>().AddMongoDbFiltering().AddMongoDbSorting().AddMongoDbProjections()
            .AddType<RecipeQuery>().AddMongoDbFiltering().AddMongoDbSorting().AddMongoDbProjections()
            .AddType<ResidentQuery>().AddMongoDbFiltering().AddMongoDbSorting().AddMongoDbProjections()
            .AddType<WeekPlanQuery>().AddMongoDbFiltering().AddMongoDbSorting().AddMongoDbProjections();

        services.AddMutationType(m => m.Name("Mutation")).AddType<RecipeMutations>().AddType<MenuPlanMutations>().AddType<ResidentMutations>();
        
        return services;
    }
}