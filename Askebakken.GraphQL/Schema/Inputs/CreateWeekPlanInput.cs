namespace Askebakken.GraphQL.Schema.Inputs;

public class CreateWeekPlanInput
{
    public DateTime FromDate { get; set; }
    public IEnumerable<CreateRecipeInput> Monday { get; set; }
    public IEnumerable<CreateRecipeInput> Tuesday { get; set; }
    public IEnumerable<CreateRecipeInput> Wednesday { get; set; }
    public IEnumerable<CreateRecipeInput> Thursday { get; set; }
    public IEnumerable<CreateRecipeInput> Friday { get; set; }
}