using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Schema;

[BsonIgnoreExtraElements]
public class MenuPlan : SchemaBase
{
    
    public ICollection<Guid> RecipeIds { get; set; }
    [BsonIgnore]
    public ICollection<Recipe> Recipes { get; set; }

    public DateTime Date { get; set; }

    public ICollection<Guid> ParticipantIds { get; set; }
    [BsonIgnore]
    public ICollection<Resident> Participants { get; set; }
}

public class MenuPlanRelationResolver
{
    public async Task<ICollection<Recipe>> GetRecipes([Parent] MenuPlan menuPlan, [Service] IMongoCollection<Recipe> collection)
    {
        var recipeIds = menuPlan.RecipeIds.ToHashSet();
        var recipeCursor = await collection.FindAsync(r => recipeIds.Contains(r.Id));
        var recipes = await recipeCursor.ToListAsync();
        return recipes;
    }
    
    public async Task<ICollection<Resident>> GetParticipants([Parent] MenuPlan menuPlan, [Service] IMongoCollection<Resident> collection)
    {
        var participantIds = menuPlan.ParticipantIds.ToHashSet();
        var participantCursor = await collection.FindAsync(r => participantIds.Contains(r.Id));
        var participants = await participantCursor.ToListAsync();
        return participants;
    }
}

public class MenuPlanType : ObjectType<MenuPlan>
{
    protected override void Configure(IObjectTypeDescriptor<MenuPlan> descriptor)
    {
        descriptor.Field(mp => mp.RecipeIds).IsProjected();
        descriptor.Field(mp => mp.ParticipantIds).IsProjected();
        
        descriptor.Field(mp => mp.Recipes).ResolveWith<MenuPlanRelationResolver>(q => q.GetRecipes(default!, default));
        descriptor.Field(mp => mp.Participants).ResolveWith<MenuPlanRelationResolver>(q => q.GetParticipants(default!, default));
        
        base.Configure(descriptor);
    }
}