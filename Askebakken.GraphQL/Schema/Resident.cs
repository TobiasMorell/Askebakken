using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Schema;

public class Resident : SchemaBase
{
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime BirthDate { get; set; }
    public bool Child => BirthDate > DateTime.Now.Date.AddYears(-18);
    public string HouseNumber { get; set; }

    public IList<string> Roles { get; set; }

    public ICollection<Guid> WeekPlanIds { get; set; }
    [BsonIgnore] public ICollection<WeekPlan> WeekPlans { get; set; }
    public ICollection<Guid> ParticipatesInIds { get; set; }
    [BsonIgnore] public ICollection<MenuPlan> ParticipatesIn { get; set; }

    public ICollection<Guid>? CooksInIds { get; set; }
    [BsonIgnore] public ICollection<MenuPlan> CooksIn { get; set; }
}

public class ResidentRelationResolver
{
    public async Task<ICollection<WeekPlan>> GetWeekPlans([Parent] Resident resident,
        [Service] IMongoCollection<WeekPlan> collection,
        CancellationToken cancellationToken = default)
    {
        var weekPlanIds = resident.WeekPlanIds.ToHashSet();
        var weekPlanCursor =
            await collection.FindAsync(r => weekPlanIds.Contains(r.Id), cancellationToken: cancellationToken);
        var weekPlans = await weekPlanCursor.ToListAsync(cancellationToken: cancellationToken);
        return weekPlans;
    }

    public async Task<ICollection<MenuPlan>> GetParticipatesIn([Parent] Resident resident,
        [Service] IMongoCollection<MenuPlan> collection,
        CancellationToken cancellationToken = default)
    {
        var participatesInIds = resident.ParticipatesInIds.ToHashSet();
        var participatesInCursor =
            await collection.FindAsync(r => participatesInIds.Contains(r.Id), cancellationToken: cancellationToken);
        var participatesIn = await participatesInCursor.ToListAsync(cancellationToken: cancellationToken);
        return participatesIn;
    }

    public async Task<ICollection<MenuPlan>> GetCooksIn([Parent] Resident resident,
        [Service] IMongoCollection<MenuPlan> collection,
        CancellationToken cancellationToken = default)
    {
        var cooksInIds = resident.CooksInIds?.ToHashSet() ?? new ();
        var cooksInCursor =
            await collection.FindAsync(r => cooksInIds.Contains(r.Id), cancellationToken: cancellationToken);
        var cooksIn = await cooksInCursor.ToListAsync(cancellationToken: cancellationToken);
        return cooksIn;
    }
}

public class ResidentType : ObjectType<Resident>
{
    protected override void Configure(IObjectTypeDescriptor<Resident> descriptor)
    {
        descriptor.Field(u => u.PasswordHash).Ignore();
        descriptor.Field(u => u.Roles).Ignore();

        descriptor.Field(u => u.WeekPlanIds).IsProjected();
        descriptor.Field(u => u.ParticipatesInIds).IsProjected();

        descriptor.Field(u => u.WeekPlans)
            .ResolveWith<ResidentRelationResolver>(q => q.GetWeekPlans(default!, default, default));
        descriptor.Field(u => u.ParticipatesIn)
            .ResolveWith<ResidentRelationResolver>(q => q.GetParticipatesIn(default!, default, default));
        descriptor.Field(u => u.CooksIn)
            .ResolveWith<ResidentRelationResolver>(q => q.GetCooksIn(default!, default, default));

        base.Configure(descriptor);
    }
}