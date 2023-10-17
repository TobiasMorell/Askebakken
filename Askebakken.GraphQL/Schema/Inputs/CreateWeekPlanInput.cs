namespace Askebakken.GraphQL.Schema.Inputs;

public class CreateWeekPlanInput
{
    public DateTime FromDate { get; set; }
    public CreateDayPlanInput Monday { get; set; }
    public CreateDayPlanInput Tuesday { get; set; }
    public CreateDayPlanInput Wednesday { get; set; }
    public CreateDayPlanInput Thursday { get; set; } 
    public CreateDayPlanInput Friday { get; set; }
}

public class CreateDayPlanInput
{
    public string? Thumbnail { get; set; }
    public IEnumerable<CreateRecipeInput> Recipes { get; set; } = Array.Empty<CreateRecipeInput>();
}