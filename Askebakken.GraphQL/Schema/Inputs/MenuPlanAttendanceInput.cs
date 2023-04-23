using HotChocolate.Authorization;

namespace Askebakken.GraphQL.Schema.Inputs;

public class MenuPlanAttendanceInput
{
    public Guid MenuPlanId { get; set; }
    [Authorize(Roles = new [] { "Admin" })]
    public Guid? ResidentId { get; set; }
}