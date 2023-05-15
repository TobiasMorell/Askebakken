using System.Reflection;
using Askebakken.GraphQL.Options;
using Askebakken.GraphQL.Schema;
using Askebakken.GraphQL.Schema.Mutations;
using Askebakken.GraphQL.Schema.Queries;
using Askebakken.GraphQL.Schema.Subscriptions;
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
        if (getCollectionMethod is null)
        {
            throw new ApplicationException(
                "Could not find GetCollection method on IMongoDatabase - this should not happen");
        }
        
        foreach (var type in SchemaTypes)
        {
            var getCollectionTyped = getCollectionMethod.MakeGenericMethod(type);
            var parameters = new object? [] { type.Name + "s", null };
            var result = getCollectionTyped.Invoke(database, parameters);
            if (result is null)
            {
                throw new ApplicationException(
                    $"Could not get collection for type {type.Name} - this should not happen");
            } 
            
            services.AddSingleton(typeof(IMongoCollection<>).MakeGenericType(type), result);
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
            .AddType<ResidentQuery>().AddMongoDbFiltering().AddMongoDbSorting().AddMongoDbProjections();

        services.AddMutationType(m => m.Name("Mutation")).AddType<RecipeMutations>().AddType<MenuPlanMutations>().AddType<ResidentMutations>();
        services.AddSubscriptionType<Subscriptions>();
        
        return services;
    }
}