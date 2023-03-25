using MongoDB.Driver;

namespace Askebakken.GraphQL.Schema;

public class WeekPlan : SchemaBase
{
    public int Year { get; set; }
    public int WeekNumber { get; set; }
    
    public ICollection<Guid> MenuPlanIds { get; set; }
    public ICollection<MenuPlan> MenuPlans { get; set; }
    public Guid AuthoredById { get; set; }
    public Resident AuthoredBy { get; set; }
}

public class WeekPlanRelationResolver
{
    public async Task<ICollection<MenuPlan>> GetMenuPlans([Parent] WeekPlan weekPlan, [Service] IMongoCollection<MenuPlan> collection)
    {
        var menuPlanIds = weekPlan.MenuPlanIds.ToHashSet();
        var menuPlanCursor = await collection.FindAsync(mp => menuPlanIds.Contains(mp.Id));
        var menuPlans = await menuPlanCursor.ToListAsync();
        return menuPlans;
    }
    
    public async Task<Resident> GetAuthoredBy([Parent] WeekPlan weekPlan, [Service] IMongoCollection<Resident> collection)
    {
        var residentCursor = await collection.FindAsync(r => r.Id == weekPlan.AuthoredById);
        var resident = await residentCursor.FirstOrDefaultAsync();
        return resident;
    }
}

public class WeekPlanType : ObjectType<WeekPlan>
{
    protected override void Configure(IObjectTypeDescriptor<WeekPlan> descriptor)
    {
        descriptor.Field(wp => wp.MenuPlanIds).IsProjected();
        descriptor.Field(wp => wp.AuthoredById).IsProjected();
        descriptor.Field(mp => mp.MenuPlans)
            .ResolveWith<WeekPlanRelationResolver>(r => r.GetMenuPlans(default!, default!));
        descriptor.Field(mp => mp.AuthoredBy)
            .ResolveWith<WeekPlanRelationResolver>(r => r.GetAuthoredBy(default!, default!));
        
        base.Configure(descriptor);
    }
}

