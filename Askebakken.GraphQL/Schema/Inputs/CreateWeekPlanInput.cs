namespace Askebakken.GraphQL.Schema.Inputs;

public class CreateWeekPlanInput
{
    public DateTime FromDate { get; set; }
    public IEnumerable<CreateRecipeInput> Monday { get; set; } = Array.Empty<CreateRecipeInput>();
    public IEnumerable<CreateRecipeInput> Tuesday { get; set; } = Array.Empty<CreateRecipeInput>();
    public IEnumerable<CreateRecipeInput> Wednesday { get; set; } = Array.Empty<CreateRecipeInput>();
    public IEnumerable<CreateRecipeInput> Thursday { get; set; } = Array.Empty<CreateRecipeInput>();
    public IEnumerable<CreateRecipeInput> Friday { get; set; } = Array.Empty<CreateRecipeInput>();
}