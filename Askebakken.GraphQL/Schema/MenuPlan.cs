using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Schema;

[BsonIgnoreExtraElements]
public class MenuPlan : SchemaBase
{
    public ICollection<Guid> RecipeIds { get; set; } = new List<Guid>();
    /// <summary>
    /// Only available when using the <see cref="MenuPlanRelationResolver"/> (aka via GraphQL). Will be null server-side.
    /// </summary>
    [BsonIgnore] public ICollection<Recipe> Recipes { get; set; } = null!;

    public DateTime Date { get; set; }

    public ICollection<Guid> ParticipantIds { get; set; } = new List<Guid>();

    /// <summary>
    /// Only available when using the <see cref="MenuPlanRelationResolver"/> (aka via GraphQL). Will be null server-side.
    /// </summary>
    [BsonIgnore]
    public ICollection<Resident> Participants { get; set; } = null!;

    public ICollection<Guid>? ChefIds { get; set; }

    /// <summary>
    /// Only available when using the <see cref="MenuPlanRelationResolver"/> (aka via GraphQL). Will be null server-side.
    /// </summary>
    [BsonIgnore]
    public ICollection<Resident> Chefs { get; set; } = null!;

    public Guest[] Guests { get; set; } = Array.Empty<Guest>();
}

public class MenuPlanRelationResolver
{
    public async Task<ICollection<Recipe>> GetRecipes([Parent] MenuPlan menuPlan,
        [Service] IMongoCollection<Recipe> collection,
        CancellationToken cancellationToken = default)
    {
        var recipeIds = menuPlan.RecipeIds.ToHashSet();
        var recipeCursor =
            await collection.FindAsync(r => recipeIds.Contains(r.Id), cancellationToken: cancellationToken);
        var recipes = await recipeCursor.ToListAsync(cancellationToken: cancellationToken);
        return recipes;
    }

    public async Task<ICollection<Resident>> GetParticipants([Parent] MenuPlan menuPlan,
        [Service] IMongoCollection<Resident> collection,
        CancellationToken cancellationToken = default)
    {
        var participantIds = menuPlan.ParticipantIds.ToHashSet();
        var participantCursor =
            await collection.FindAsync(r => participantIds.Contains(r.Id), cancellationToken: cancellationToken);
        var participants = await participantCursor.ToListAsync(cancellationToken: cancellationToken);
        return participants;
    }

    public async Task<ICollection<Resident>> GetChefs([Parent] MenuPlan menuPlan,
        [Service] IMongoCollection<Resident> collection,
        CancellationToken cancellationToken = default)
    {
        if (menuPlan.ChefIds is null)
        {
            return Array.Empty<Resident>();
        }

        var chefIds = menuPlan.ChefIds.ToHashSet();
        var chefCursor = await collection.FindAsync(r => chefIds.Contains(r.Id), cancellationToken: cancellationToken);
        var chefs = await chefCursor.ToListAsync(cancellationToken: cancellationToken);
        return chefs;
    }

    /*public async Task<ICollection<Guest>> GetGuests([Parent] MenuPlan menuPlan,
        [Service] IMongoCollection<Guest> collection,
        CancellationToken cancellationToken = default)
    {
        if (menuPlan.GuestsIds is null)
        {
            return Array.Empty<Guest>();
        }

        var guestIds = menuPlan.GuestsIds.ToHashSet();
        var guestsCursor =
            await collection.FindAsync(r => guestIds.Contains(r.Id), cancellationToken: cancellationToken);
        var guests = await guestsCursor.ToListAsync(cancellationToken: cancellationToken);
        return guests;
    }*/
}

public class MenuPlanType : ObjectType<MenuPlan>
{
    protected override void Configure(IObjectTypeDescriptor<MenuPlan> descriptor)
    {
        descriptor.Field(mp => mp.RecipeIds).IsProjected();
        descriptor.Field(mp => mp.ParticipantIds).IsProjected();
        descriptor.Field(mp => mp.ChefIds).IsProjected();

        descriptor.Field(mp => mp.Recipes)
            .ResolveWith<MenuPlanRelationResolver>(q => q.GetRecipes(default!, default!, default));
        descriptor.Field(mp => mp.Participants)
            .ResolveWith<MenuPlanRelationResolver>(q => q.GetParticipants(default!, default!, default));
        descriptor.Field(mp => mp.Chefs)
            .ResolveWith<MenuPlanRelationResolver>(q => q.GetChefs(default!, default!, default));
        // descriptor.Field(mp => mp.Guests)
        //     .ResolveWith<MenuPlanRelationResolver>(q => q.GetGuests(default!, default!, default));
        descriptor.Field(mp => mp.Guests);

        base.Configure(descriptor);
    }
}